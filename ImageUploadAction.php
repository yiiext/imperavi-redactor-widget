<?php
/**
 * Action to handle image uploads from imperavi-redactor-widget
 *
 * @author Bogdan Savluk <savluk.bogdan@gmail.com>
 *
 * Example of use:
 *  1. add it to your conroller actions()
 *      'imgUpload'=>array(
 *          'class'=>'ext.imperavi-redactor-widget.ImageUploadAction',
 *          'directory' => 'uploads/redactor'
 *          'validator'=>array(
 *              'mimeTypes' => array('image/png', 'image/jpg', 'image/gif', 'image/jpeg', 'image/pjpeg')
 *              // Add uploads validation by mimeType, (Any other CFileValidator options are also available)
 *          )
 *      ),
 *
 *  2. render your widget specifying url and options for upload
 *
 *      $this->widget('ext.imperavi-redactor-widget.ImperaviRedactorWidget', array(
 *          'model' => $model,
 *          'attribute' => 'redactorArea',
 *
 *          'options' => array(
 *              // place here route to your ImageUploadAction
 *              'imageUpload'=>$this->createUrl('imgUpload'),
 *              // alert user if image upload was failed
 *              'imageUploadErrorCallback'=>'js:function(obj, json){ alert(json.error); }',
 *
 *              // additional field if you have csrf request validation enabled
 *              'uploadFields'=>array(
 *                  Yii::app()->request->csrfTokenName => Yii::app()->request->csrfToken,
 *              ),
 *          ),
 *
 *      ));
 *
 *
 */
class ImageUploadAction extends CAction
{
    /**
     * Path to directory where to save uploaded files(relative path from webroot)
     * Should be either string or callback that will return it
     * @var string
     */
    public $directory = 'uploads/redactor';


    private $_validator = array(
        // default options
    );

    public function getValidator()
    {
        return $this->_validator;
    }

    public function setValidator($v)
    {
        $this->_validator = array_merge($this->_validator, $v);
    }

    public function run()
    {

        if (is_string($this->directory)) {
            $dir = $this->directory;
        } elseif (is_callable($this->directory, true)) {
            $dir = call_user_func($this->directory);
        } else
            throw new CException(Yii::t('imperavi-redactor-widget.main', '$directory property should be set'));

        $uploadModel = new UploadedImage($this->validator);
        $uploadModel->file = CUploadedFile::getInstanceByName('file');

        if ($uploadModel->validate()) {
            $fileLink = $uploadModel->save($dir);
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

    public function save($dir)
    {
        $webroot = Yii::getPathOfAlias('webroot');

        $id = time();
        $sub = substr($id, -2);
        $id = substr($id, 0, -2);
        $dstDir = '/' . $dir . '/' . $sub . '/';
        if (!is_dir($webroot . $dstDir)) {
            mkdir($webroot . $dstDir, 0777, true);
        }

        $filePath = $dstDir . $id . $this->file->extensionName;
        $this->file->saveAs($webroot . $filePath);
        return $filePath;
    }

}
