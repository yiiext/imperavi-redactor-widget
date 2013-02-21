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
 *              'imageUpload'=>$this->createUrl('imgUpload'), // place here route to your ImageUploadAction
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
     * @var string
     */
    public $directory = 'uploads/redactor';

    public function run()
    {
        if (Yii::app()->user->isGuest)
            throw new CHttpException(403);

        $dir = $this->directory;

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

            copy($_FILES['file']['tmp_name'], Yii::getPathOfAlias('webroot') . $file);
            $array = array(
                'filelink' => Yii::app()->request->baseUrl . $file,
            );
            echo CJSON::encode($array);
        } else {
            echo CJSON::encode(array(
                "error" => "Wrong file type",
                "anothermessage" => "Mime-type \"" . $_FILES['file']['type'] . "\" is not allowed",
            ));
        }
    }
}
