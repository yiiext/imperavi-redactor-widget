Imperavi Redactor Widget
========================

`ImperaviRedactorWidget` — обёртка для [Imperavi Redactor](http://imperavi.com/redactor/),
довольно неплохого WYSIWYG редактора.

Обратите внимание, что сам Imperavi Redactor — коммерческий продукт и не является
OpenSource, но так как сообщество Yii купило OEM-лицензию, то вы можете бесплатно
пользоваться им в проектах на Yii.

Использование
-------------

Импортируем виджет:

```php
Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
```

Вызываем виджет:

```php
$this->widget('ImperaviRedactorWidget', array(
	// можно использовать пару имя модели - имя свойства
	'model'=>$my_model,
	'attribute'=>'my_field',

	// или только имя поля ввода
	'name'=>'my_input_name',

	// немного опций, см. http://imperavi.com/redactor/docs/
	'options'=>array(
		'lang'=>'en',
		'toolbar'=>'mini',
		'css'=>'wym.css',
	),
));
```

Также можно подключить Redactor к уже существующим на странице элементам:

```php
$this->widget('ImperaviRedactorWidget',array(
	// селектор для textarea
	'selector'=>'.redactor',
	// немного опций, см. http://imperavi.com/redactor/docs/
	'options'=>array(),
));
```

Для локализации редактора нужно скачать необходимый языковой файл c
[сайта разработчиков](http://imperavi.com/redactor/docs/languages/),
скопировать его, например, в папку assets, и подключить скрипт на страницу.

```php
$this->widget('ImperaviRedactorWidget',array(
	'model'=>$model,
	'attribute'=>'fieldname',
	'options'=>array(
		'lang'=>'ru',
	),
));
$cs=Yii::app()->clientScript;
// Путь до protected/extensions/imperavi-redactor-widget/assets
$baseUrl=$cs->packages[ImperaviRedactorWidget::PACKAGE_ID]['baseUrl'];
$cs->registerScriptFile($baseUrl.'/ru.js');
```

Способ подключения дополнительных плагинов мало чем отличается от подключения
языковых файлов. Копируем js-файл плагина в assets и подключаем его. Некоторые
плагины можно скачать на [сайта разработчиков](http://imperavi.com/redactor/docs/plugins/).

```php
$this->widget('ImperaviRedactorWidget',array(
	'model'=>$model,
	'attribute'=>'fieldname',
	'options'=>array(
		'lang'=>'ru',
		'plugins'=>array('fullscreen'),
	),
));
$cs=Yii::app()->clientScript;
$baseUrl=$cs->packages[ImperaviRedactorWidget::PACKAGE_ID]['baseUrl'];
$cs->registerScriptFile($baseUrl.'/ru.js');
$cs->registerScriptFile($baseUrl.'/fullscreen.js');
```
