<?php

include "../config.php";

if (isset($_GET['file']))
{
	download(FILES_ROOT.$_GET['file']);
	exit;
}

function download($filename, $filenamef = false, $mimetype='application/octet-stream')
{
	if (!file_exists($filename)) die('File not found');

	$from = $to = 0;
	$cr = NULL;

	if (isset($_SERVER['HTTP_RANGE']))
	{
		$range = substr($_SERVER['HTTP_RANGE'], strpos($_SERVER['HTTP_RANGE'], '=')+1);
		$from = strtok($range, '-');
		$to = strtok('/');
		if ($to>0) $to++;
		if ($to) $to-=$from;
		header('HTTP/1.1 206 Partial Content');
		$cr = 'Content-Range: bytes ' . $from . '-' . (($to)?($to . '/' . $to+1):filesize($filename));
	}
	else header('HTTP/1.1 200 Ok');

	if ($filenamef === false) $filenamef = $filename;

	$etag = md5($filename);
	$etag = substr($etag, 0, 8) . '-' . substr($etag, 8, 7) . '-' . substr($etag, 15, 8);
	header('ETag: "' . $etag . '"');
	header('Accept-Ranges: bytes');
	header('Content-Length: ' . (filesize($filename)-$to+$from));
	if ($cr) header($cr);
	header('Connection: close');
	header('Content-Type: ' . $mimetype);
	header('Last-Modified: ' . gmdate('r', filemtime($filename)));
	$f = fopen($filename, 'r');
	header('Content-Disposition: attachment; filename="' . basename($filenamef) . '";');
	if ($from) fseek($f, $from, SEEK_SET);
	if (!isset($to) || empty($to)) $size=filesize($filename)-$from;
	else $size=$to;
	$downloaded = 0;
	while(!feof($f) && !connection_status() && ($downloaded<$size))
	{
		echo fread($f, 512000);
		$downloaded+=512000;
		flush();
	}
	fclose($f);
}
	
?>