<?php
	
include "../config.php";

$_FILES['file']['type'] = strtolower($_FILES['file']['type']);

if ($_FILES['file']['type'] == 'image/png' 
|| $_FILES['file']['type'] == 'image/jpg' 
|| $_FILES['file']['type'] == 'image/gif' 
|| $_FILES['file']['type'] == 'image/jpeg'
|| $_FILES['file']['type'] == 'image/pjpeg')
{	
	copy($_FILES['file']['tmp_name'], IMAGES_ROOT.md5(date('YmdHis')).'.jpg');
	echo '/tmp/images/'.md5(date('YmdHis')).'.jpg';
}
?>




