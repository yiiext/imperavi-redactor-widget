<?php
/**
 * ImperaviRedactorWidget class file.
 *
 * @property string $assetsPath
 * @property string $assetsUrl
 * @property array $plugins
 *
 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @author Alexander Makarov <sam@rmcreative.ru>
 *
 * @version 1.2.4
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
	 * @var array
	 */
	private $_plugins = array();

	/**
	 * Init widget.
	 */
	public function init()
	{
		parent::init();

		if ($this->selector === null) {
			list($this->name, $this->id) = $this->resolveNameID();
			$this->htmlOptions['id'] = $this->id;
			$this->selector = '#' . $this->id;

			if ($this->hasModel()) {
				echo CHtml::activeTextArea($this->model, $this->attribute, $this->htmlOptions);
			} else {
				echo CHtml::textArea($this->name, $this->value, $this->htmlOptions);
			}
		}

		// Default scripts package.
		$this->package = array(
			'baseUrl' => $this->assetsUrl,
			'js' => array(
				YII_DEBUG ? 'redactor.js' : 'redactor.min.js',
			),
			'css' => array(
				'redactor.css',
			),
			'depends' => array(
				'jquery',
			),
		);

		// Append language file to scripts package.
		if (isset($this->options['lang']) && $this->options['lang'] !== 'en') {
			$this->package['js'][] = 'lang/' . $this->options['lang'] . '.js';
		}

		$this->registerClientScript();
	}

	/**
	 * Register CSS and Script.
	 */
	protected function registerClientScript()
	{
		// Insert plugins in options
		if (!empty($this->_plugins)) {
			$this->options['plugins'] = array_keys($this->_plugins);
		}

		$clientScript = Yii::app()->clientScript;
		$selector = CJavaScript::encode($this->selector);
		$options = CJavaScript::encode($this->options);

		$clientScript
			->addPackage(self::PACKAGE_ID, $this->package)
			->registerPackage(self::PACKAGE_ID)
			->registerScript(
				$this->id,
				'jQuery(' . $selector . ').redactor(' . $options . ');',
				CClientScript::POS_READY
			);

		foreach ($this->plugins as $id => $plugin) {
			$clientScript
				->addPackage(self::PACKAGE_ID . '-' . $id, $plugin)
				->registerPackage(self::PACKAGE_ID . '-' . $id);
		}
	}

	/**
	 * Get the assets path.
	 * @return string
	 */
	public function getAssetsPath()
	{
		return  dirname(__FILE__) . '/assets';
	}

	/**
	 * Publish assets and return url.
	 * @return string
	 */
	public function getAssetsUrl()
	{
		return Yii::app()->assetManager->publish($this->assetsPath);
	}

	/**
	 * @param array $plugins
	 */
	public function setPlugins(array $plugins)
	{
		foreach ($plugins as $id => $plugin) {
			if (!isset($plugin['baseUrl']) && !isset($plugin['basePath'])) {
				$plugin['baseUrl'] = $this->assetsUrl . '/plugins/' . $id;
			}
			$this->_plugins[$id] = $plugin;
		}
	}

	/**
	 * @return array
	 */
	public function getPlugins()
	{
		return $this->_plugins;
	}
}
