<?php

include "../config.php";


if (!empty($_FILES['file']['name']))
{		
	
	$file_size = $_FILES['file']['size'];
	$file_type = info($_FILES['file']['name'], 'type');
	$file_name = str_replace('.'.$file_type, '', $_FILES['file']['name']);		

	// $file_id = md5(date('YmdHis').$file_name);
	
	$file_name = get_filename(FILES_ROOT, $_FILES['file']['name'], $file_type);


	$file_ico = get_ico($file_type);
	
	$file = FILES_ROOT.$file_name;
	copy($_FILES['file']['tmp_name'], $file);
	
	
	echo '<a href="javascript:void(null);" rel="'.$file_name.'" class="redactor_file_link redactor_file_ico_'.$file_ico.'">'.$file_name.'</a>';
}	

function get_ico($type)
{
	$fileicons = array('other' => 0, 'avi' => 'avi', 'doc' => 'doc', 'docx' => 'doc', 'gif' => 'gif', 'jpg' => 'jpg', 'jpeg' => 'jpg', 'mov' => 'mov', 'csv' => 'csv', 'html' => 'html', 'pdf' => 'pdf', 'png' => 'png', 'ppt' => 'ppt', 'rar' => 'rar', 'rtf' => 'rtf', 'txt' => 'txt', 'xls' => 'xls', 'xlsx' => 'xls', 'zip' => 'zip');

	if (isset($fileicons[$type])) return $fileicons[$type];
	else return 'other';
}

function get_filename($path, $filename, $file_type)
{
	if (!file_exists($path.$filename)) return $filename;

	$filename = str_replace('.'.$file_type, '', $filename);
	
	$new_filename = '';
	for ($i = 1; $i < 100; $i++)
	{			
		if (!file_exists($path.$filename.$i.'.'.$file_type))
		{
			$new_filename = $filename.$i.'.'.$file_type;
			break;
		}
	}

	if ($new_filename == '') return false;
	else return $new_filename;		
}	

function info($file, $key = false)
{
	$info = array();
	$array = explode(".", $file);

	$info['size'] = @filesize($file);
	//$info['time'] = filectime($file);
   	$info['type'] = end($array);
	$info['name'] = str_replace('.'.$info['type'], '', $file);
	$info['image'] = false;

	if ($info['type'] == 'JPG' ||
		$info['type'] == 'jpg' ||
		$info['type'] == 'gif' ||
		$info['type'] == 'png')
	{
		$info['image'] = true;
	}

	if (!$key) return $info;
	else return $info[$key];

}

	
?>