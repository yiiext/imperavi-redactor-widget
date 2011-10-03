ImperaviRedactorWidget
=======================

ImperaviRedactorWidget wrapper around [imperavi WYSIWYG](http://imperavi.ru/redactor/).

Usage
-----
~~~
[php]
Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
$this->widget('ImperaviRedactorWidget',array(
	// you can either use it for model attribute
	'model'=>$my_model,
	'attribute'=>'my_field',
	// or just for input field
	'name'=>'my_input_name',
	// imperavi redactor [options](http://imperavi.ru/redactor/docs/)
	'options'=>array(
		'toolbar'=>'classic',
		'cssPath'=>Yii::app()->theme->baseUrl.'/css/',
	),
));
~~~
