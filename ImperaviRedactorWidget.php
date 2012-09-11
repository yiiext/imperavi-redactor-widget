<?php
/**
 * ImperaviRedactorWidget class file.
 *
 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @link https://github.com/yiiext/imperavi-redactor-widget
 * @license http://www.opensource.org/licenses/bsd-license.php
 */
/**
 * ImperaviRedactorWidget wrapper around {@link http://redactorjs.com Fantastic WYSIWYG-editor on jQuery}.
 *
 * Usage:
 *
 * First, import the class file
 * <pre>
 * Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
 * </pre>
 *
 * Next, render the textarea and create it into redactor
 * <pre>
 * $this->widget('ImperaviRedactorWidget',array(
 *     // you can either use it for model attribute
 *     'model'=>$my_model,
 *     'attribute'=>'my_field',
 *     // or just for input field
 *     'name'=>'my_input_name',
 *     // imperavi redactor {@link http://redactorjs.com/docs/ options}
 *     'options'=>array(
 *         'lang'=>'en',
 *     ),
 * ));
 * </pre>
 * Or create redactor from textarea by selector
 * <pre>
 * $this->widget('ImperaviRedactorWidget',array(
 *     // the textarea selector
 *     'selector'=>'.redactor',
 *     // imperavi redactor {@link http://redactorjs.com/docs/ options}
 *     'options'=>array(),
 * ));
 * </pre>
 *
 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @version 0.7
 * @package yiiext.imperavi-redactor-widget
 * @link http://redactorjs.com
 */
class ImperaviRedactorWidget extends \CInputWidget
{
	/**
	 * Assets package ID.
	 */
	const PACKAGE_ID = 'imperavi-redactor';
	/**
	 * @var array {@link http://redactorjs.com/docs redactor options}.
	 */
	public $options = array();
	/**
	 * @var string|null The textarea selector. If it null, will be render the textarea.
	 * Defaults to null.
	 */
	public $selector;

	/**
	 * Init widget.
	 */
	public function init()
	{
		parent::init();

		if ($this->selector === null) {
			list($this->name, $this->id) = $this->resolveNameId();
			$this->selector = '#' . $this->id;

			if ($this->hasModel()) {
				echo \CHtml::activeTextArea($this->model, $this->attribute, $this->htmlOptions);
			} else {
				$this->htmlOptions['id'] = $this->id;
				echo \CHtml::textArea($this->name, $this->value, $this->htmlOptions);
			}
		}

		$this->registerClientScript();
	}

	/**
	 * Register CSS and Script.
	 */
	protected function registerClientScript()
	{
		/** @var $cs \CClientScript */
		$cs = Yii::app()->clientScript;
		if (!isset($cs->packages[self::PACKAGE_ID])) {
			/** @var $am \CAssetManager */
			$am = Yii::app()->assetManager;
			$cs->packages[self::PACKAGE_ID] = array(
				'basePath' => dirname(__FILE__) . '/assets',
				'baseUrl' => $am->publish(dirname(__FILE__) . '/assets'),
				'js' => array(
					'redactor' . (YII_DEBUG ? '' : '.min') . '.js',
				),
				'css' => array(
					'redactor.css',
				),
				'depends' => array(
					'jquery',
				),
			);
		}
		$cs->registerPackage(self::PACKAGE_ID);

		$cs->registerScript(
			__CLASS__ . '#' . $this->id,
			'jQuery(' . \CJavaScript::encode($this->selector) . ').redactor(' . \CJavaScript::encode($this->options) . ');',
			\CClientScript::POS_READY
		);
	}
}
