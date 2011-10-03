ImperaviRedactorWidget
=======================

Позволяет использовать [imperavi redactor](http://redactor.imperavi.ru/) как виджет формы.

Использование
-------------
~~~
[php]
ImperaviRedactorWidget
=======================

ImperaviRedactorWidget wrapper around [imperavi WYSIWYG](http://imperavi.ru/redactor/).

Usage
-----
~~~
[php]
Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
$this->widget('ImperaviRedactorWidget',array(
	// можно использовать как для поля модели
	'model'=>$my_model,
	'attribute'=>'my_field',
	// так и просто для элемента формы
	'name'=>'my_input_name',
	// [настройки](http://imperavi.ru/redactor/docs/) редактора imperavi
	'options'=>array(
		'toolbar'=>'classic',
		'cssPath'=>Yii::app()->theme->baseUrl.'/css/',
	),
));
~~~
