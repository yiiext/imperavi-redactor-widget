<?php
/**
 * Action to handle image uploads from imperavi-redactor-widget
 *
 * @author Bogdan Savluk <savluk.bogdan@gmail.com>
 *
 * For examples see image_upload_readme.md
 */
class ImageUploadAction extends CAction
{
    /**
     * Path to directory where to save uploaded files(relative path from webroot)
     * Should be either string or callback that will return it
     * @var string
     */
    public $directory;

    /**
     * Callback for function to implement own saving mechanism
     * The only argument passed to callback is CUploadedFile, callback should return url to file
     * @var callable
     */
    public $saveCallback;

    private $_validator = array( // default options
    );

    public function getValidator()
    {
        return $this->_validator;
    }

    public function setValidator($v)
    {
        $this->_validator = array_merge($this->_validator, $v);
    }

    /**
     * Function used to save image by default
     * @param CUploadedFile $file
     * @return string
     * @throws CException
     */
    public function save($file)
    {
        if (is_string($this->directory)) {
            $dir = $this->directory;
        } elseif (is_callable($this->directory, true)) {
            $dir = call_user_func($this->directory);
        } else {
            throw new CException(Yii::t('imperavi-redactor-widget.main', '$directory property, should be either string or callable'));
        }

        $webroot = Yii::getPathOfAlias('webroot');

        $id = time();
        $sub = substr($id, -2);
        $id = substr($id, 0, -2);
        $dstDir = '/' . $dir . '/' . $sub . '/';
        if (!is_dir($webroot . $dstDir)) {
            mkdir($webroot . $dstDir, 0777, true);
        }

        $filePath = $dstDir . $id . $file->extensionName;
        $file->saveAs($webroot . $filePath);
        return $filePath;
    }

    public function run()
    {
        if (isset($this->saveCallback) && is_callable($this->saveCallback)) {
            $save = $this->saveCallback;
        } elseif (isset($this->directory)) {
            $save = array($this, 'save');
        } else
            throw new CException(Yii::t('imperavi-redactor-widget.main', 'Either $directory property, or $saveCallback should be set'));
        $uploadModel = new UploadedImage($this->validator);
        $uploadModel->file = CUploadedFile::getInstanceByName('file');

        if ($uploadModel->validate()) {
            $fileLink = call_user_func($save, $uploadModel->file);
            echo CJSON::encode(array(
                'filelink' => $fileLink,
            ));
        } else {
            echo CJSON::encode(array(
                "error" => $uploadModel->getErrors('file'),
            ));
        }
    }
}

class UploadedImage extends CModel
{
    protected $validator;

    /** @var CUploadedFile */
    public $file;

    /**
     * Returns the list of attribute names of the model.
     * @return array list of attribute names.
     */
    public function attributeNames()
    {
        return array(
            'file' => Yii::t('imperavi-redactor-widget.main', "File"),
        );
    }

    function __construct($validator = array())
    {
        $this->validator = $validator;
    }

    public function rules()
    {
        $validator = array('file', 'file') + $this->validator;

        return array(
            $validator,
        );
    }
}
