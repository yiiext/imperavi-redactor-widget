ImperaviRedactorWidget
=======================

ImperaviRedactorWidget wrapper around [Fantastic WYSIWYG-editor on jQuery](http://redactorjs.com).

Usage
------------

First, import the class file
~~~
Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
~~~

Next, render the textarea and create it into redactor
~~~
$this->widget('ImperaviRedactorWidget',array(
	// you can either use it for model attribute
	'model'=>$my_model,
	'attribute'=>'my_field',
	// or just for input field
	'name'=>'my_input_name',
	// imperavi redactor {@link http://redactorjs.com/docs/ options}
	'options'=>array(
		'lang'=>'en',
		'toolbar'=>'mini',
		'css'=>'wym.css',
	),
));
~~~

Or create redactor from textarea by selector
~~~
$this->widget('ImperaviRedactorWidget',array(
	// the textarea selector
	'selector'=>'.redactor',
	// imperavi redactor {@link http://redactorjs.com/docs/ options}
	'options'=>array(),
));
~~~
