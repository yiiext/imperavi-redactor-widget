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
 *          'directory = 'uploads/redactor'
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

    public function run()
    {

        if (is_string($this->directory)) {
            $dir = $this->directory;
        } elseif (is_callable($this->directory, true)) {
            $dir = call_user_func($this->directory);
        } else
            throw new CException('$directory property should be set');

        $_FILES['file']['type'] = strtolower($_FILES['file']['type']);

        $ext = null;

        switch ($_FILES['file']['type']) {
            case 'image/png':
                $ext = '.png';
                break;
            case 'image/jpg':
                $ext = '.jpg';
                break;
            case 'image/gif':
                $ext = '.gif';
                break;
            case 'image/jpeg':
                $ext = '.jpg';
                break;
            case 'image/pjpeg':
                $ext = '.jpg';
                break;
        }

        if (isset($ext)) {
            $id = time();
            $sub = substr($id, -2);
            $id = substr($id, 0, -2);
            $dstDir = '/' . $dir . '/' . $sub . '/';
            if (!is_dir(Yii::getPathOfAlias('webroot') . $dstDir)) {
                mkdir(Yii::getPathOfAlias('webroot') . $dstDir, 0777, true);
            }

            $file = $dstDir . $id . $ext;

            move_uploaded_file($_FILES['file']['tmp_name'], Yii::getPathOfAlias('webroot') . $file);
            $array = array(
                'filelink' => Yii::app()->request->baseUrl . $file,
            );
            echo CJSON::encode($array);
        } else {
            echo CJSON::encode(array(
                "error" => Yii::t('imperavi-redactor-widget.main', "Wrong file type"),
            ));
        }
    }
}
