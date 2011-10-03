<?php
/**
 * ImperaviRedactorWidget class file.
 *
 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @link https://github.com/yiiext/imperavi-redactor-widget
 * @license http://www.opensource.org/licenses/bsd-license.php
 */
/**
 * ImperaviRedactorWidget wrapper around {@link http://imperavi.ru/redactor/ imperavi WYSIWYG}.
 *
 * Usage:
 * <pre>
 * Yii::import('ext.imperavi-redactor-widget.ImperaviRedactorWidget');
 * $this->widget('ImperaviRedactorWidget',array(
 *     // you can either use it for model attribute
 *     'model'=>$my_model,
 *     'attribute'=>'my_field',
 *     // or just for input field
 *     'name'=>'my_input_name',
 *     // imperavi redactor {@link http://imperavi.ru/redactor/docs/ options}
 *     'options'=>array(
 *         'toolbar'=>'classic',
 *         'cssPath'=>Yii::app()->theme->baseUrl.'/css/',
 *     ),
 * ));
 * </pre>

 * @author Veaceslav Medvedev <slavcopost@gmail.com>
 * @version 0.4
 * @package yiiext.imperavi-redactor-widget
 * @link http://imperavi.ru/redactor/
 */
class ImperaviRedactorWidget extends CInputWidget
{
	/**
	 * @var string
	 */
	public $packageName='imperavi-redactor';
	/**
	 * @var array imperavi redactor {@link http://imperavi.ru/redactor/docs/ options}.
	 */
	public $options=array();

	/**
	 * Init widget.
	 */
	public function init()
	{
		list($this->name,$this->id)=$this->resolveNameId();
		$this->getPackage();
	}
	/**
	 * Run widget.
	 */
	public function run()
	{
		if(isset($this->options['path']))
			$this->options['path']=rtrim($this->options['path'],'/\\').'/';

		$this->registerClientScript();

		if($this->hasModel())
			echo CHtml::activeTextArea($this->model,$this->attribute,$this->htmlOptions);
		else
			echo CHtml::textArea($this->name,$this->value,$this->htmlOptions);
	}
	/**
	 * @return array
	 */
	public function getPackage()
	{
		/**
		 * @var CClientScript $cs
		 * @var CAssetManager $ap
		 */
		$cs=Yii::app()->getClientScript();
		$ap=Yii::app()->getAssetManager();

		if(!isset($cs->packages[$this->packageName]))
			$cs->packages[$this->packageName]=array(
				'basePath'=>dirname(__FILE__).'/assets',
				/**
				 * @todo Add minimizied script.
				 */
				'js'=>array('redactor'.(YII_DEBUG?'':'').'.js',),
				'css'=>array('css/redactor.css',),
				'depends'=>array('jquery',),
			);

		// Publish package assets. Force copy assets in debug mode.
		if(!isset($cs->packages[$this->packageName]['baseUrl']))
			$cs->packages[$this->packageName]['baseUrl']=$ap->publish($cs->packages[$this->packageName]['basePath'],false,-1,YII_DEBUG);

		return $cs->packages[$this->packageName];
	}
	/**
	 * Register CSS and Script.
	 */
	protected function registerClientScript()
	{
		/**
		 * @var CClientScript $cs
		 */
		$cs=Yii::app()->getClientScript();
		$cs->registerPackage($this->packageName);
		$cs->registerScript(
			__CLASS__.'#'.$this->getId(),
			'jQuery('.CJavaScript::encode('#'.$this->getId()).').redactor('.CJavaScript::encode($this->options).');',
			CClientScript::POS_READY
		);
	}
}
