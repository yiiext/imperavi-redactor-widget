<?php
/**
 * ImperaviRedactorWidget class file.
 *
 * @property string $assetsPath
 * @property string $assetsUrl
 *
 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @author Alexander Makarov <sam@rmcreative.ru>
 *
 * @version 1.1
 *
 * @link https://github.com/yiiext/imperavi-redactor-widget
 * @link http://imperavi.com/redactor
 * @license https://github.com/yiiext/imperavi-redactor-widget/blob/master/license.md
 */
class ImperaviRedactorWidget extends CInputWidget
{
	/**
	 * Assets package ID.
	 */
	const PACKAGE_ID = 'imperavi-redactor';

	/**
	 * @var array {@link http://imperavi.com/redactor/docs/ redactor options}.
	 */
	public $options = array();

	/**
	 * @var string|null Selector pointing to textarea to initialize redactor for.
	 * Defaults to null meaning that textarea does not exist yet and will be
	 * rendered by this widget.
	 */
	public $selector;

	/**
	 * @var array
	 */
	public $package = array();

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
				echo CHtml::activeTextArea($this->model, $this->attribute, $this->htmlOptions);
			} else {
				$this->htmlOptions['id'] = $this->id;
				echo CHtml::textArea($this->name, $this->value, $this->htmlOptions);
			}
		}

		// Default scripts package.
		$this->package = array(
			'baseUrl' => $this->assetsUrl,
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

		// Prepend language file to scripts package.
		if (isset($this->options['lang'])) {
			array_unshift($this->package['js'], '/langs/' . $this->options['lang'] . '.js');
		}

		$this->registerClientScript();
	}

	/**
	 * Register CSS and Script.
	 */
	protected function registerClientScript()
	{
		Yii::app()->clientScript
			->addPackage(self::PACKAGE_ID, $this->package)
			->registerPackage(self::PACKAGE_ID)
			->registerScript(
				$this->id,
				'jQuery(' . CJavaScript::encode($this->selector) . ').redactor(' . CJavaScript::encode($this->options) . ');',
				CClientScript::POS_READY
			);
	}

	/**
	 * Get the assets path.
	 * @return string
	 */
	public function getAssetsPath()
	{
		return __DIR__ . '/assets';
	}

	/**
	 * Publish assets and return url.
	 * @return string
	 */
	public function getAssetsUrl()
	{
		return Yii::app()->assetManager->publish($this->assetsPath);
	}
}
