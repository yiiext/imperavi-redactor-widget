Imperavi Redactor Widget
========================

`ImperaviRedactorWidget` is a wrapper for [Imperavi Redactor](http://imperavi.com/redactor/),
a high quality WYSIWYG editor.

Note that Imperavi Redactor itself is a proprietary commercial copyrighted software
but since Yii community bought OEM license you can use it for free with Yii.

Usage
-----

First, import the widget class file

```php
Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
```

Next, call the widget:

```php
$this->widget('ImperaviRedactorWidget', array(
	// You can either use it for model attribute
	'model' => $my_model,
	'attribute' => 'my_field',

	// or just for input field
	'name' => 'my_input_name',

	// Some options, see http://imperavi.com/redactor/docs/
	'options' => array(
		'lang' => 'ru',
		'toolbar' => false,
		'iframe' => true,
		'css' => 'wym.css',
	),
));
```

Alternatively you can attach Redactor to already existing DOM element by calling:

```php
$this->widget('ImperaviRedactorWidget', array(
	// The textarea selector
	'selector' => '.redactor',
	// Some options, see http://imperavi.com/redactor/docs/
	'options' => array(),
));
```

The redactor plugins plugged in with packages of resources.

```php
$this->widget('ImperaviRedactorWidget', array(
	'selector' => '.redactor',
	'options' => array(
		'lang' => 'ru',
	),
	'plugins' => array(
		'fullscreen' => array(
			'js' => array('fullscreen.js',),
		),
		'clips' => array(
			// You can set base path to assets
			'basePath' => 'application.components.imperavi.my_plugin',
			// or url, basePath will be ignored.
			// Defaults is url to plugis dir from assets
			'baseUrl' => '/js/my_plugin',
			'css' => array('clips.css',),
			'js' => array('clips.js',),
			// add depends packages
			'depends' => array('imperavi-redactor',),
		),
	),
));
```

To support Redactor's **file and image upload** capabilities (http://imperavi.com/redactor/docs/images, http://imperavi.com/redactor/docs/files/), the widget includes 3 actions: *'fileUpload'*, *'imageUpload'*, and *'imageList'*; which you can use as follows:

**(1).** Create an "uploads" directory in your project's root folder to host your uploaded files (configure proper permissions so your users can upload files there).

**(2).** Declare the new actions inside your controller. Example:

```php
class MyController extends Controller
{
	// (...) Your existing Controller code (...)
	
	public function actions()
	{
		return array(
			'fileUpload'=>array(
				'class'=>'ext.imperavi-redactor-widget.actions.FileUpload',
				'uploadCreate'=>true,
				'permissions'=>0664,
			),
			'imageUpload'=>array(
				'class'=>'ext.imperavi-redactor-widget.actions.ImageUpload',
				'uploadCreate'=>true,
				'permissions'=>0664,
			),
			'imageList'=>array(
				'class'=>'ext.imperavi-redactor-widget.actions.ImageList',
			)
		);
	}
}
```
**(3).** Inside your controller, add the corresponding access rules for these actions (or 403 errors will happen). Ej:

```php
public function accessRules()
{
	return array(
		// (...) Your existing rules (...)
		
		array('allow',
			'actions'=>array('fileUpload', 'imageUpload', 'imageList'),
			'users'=>array('admin'),
		),
	);
}
```

**(4).** When initializing the widget, include the file and image upload options ( *'fileUpload'*, *'fileUploadErrorCallback'*, *'imageUpload'*, *'imageGetJson'* and/or *'imageUploadErrorCallback'*, as described in http://imperavi.com/redactor/docs/settings). Make sure the URLs in *createUrl()* make sense for the new actions ( *controller/action* ). Example:

```php
$controllerName = "mycontroller";
$this->widget('ImperaviRedactorWidget', array(
	'model'=>$model_reference,
	'attribute'=>'my_attribute',
	
	'options'=>array(
		'fileUpload'=>Yii::app()->createUrl($controllerName . '/fileUpload',array(
			'attr'=>'my_attribute'
		)),
		'fileUploadErrorCallback'=>new CJavaScriptExpression(
			'function(obj,json) { alert(json.error); }'
		),
		'imageUpload'=>Yii::app()->createUrl($controllerName . '/imageUpload',array(
			'attr'=>'my_attribute'
		)),
		'imageGetJson'=>Yii::app()->createUrl($controllerName . '/imageList',array(
			'attr'=>'my_attribute'
		)),
		'imageUploadErrorCallback'=>new CJavaScriptExpression(
			'function(obj,json) { alert(json.error); }'
		),
	),
));
```

The "Insert image/file" dialogs should have changed by now.
