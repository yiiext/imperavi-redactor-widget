<?php

$html = stripslashes(urldecode($_POST['editor']));
echo typo($html);

function typo($html, $lang = 'ru')
{
	$html = stripslashes($html);

	// remove pre
	preg_match_all('/<pre>([\\w\\W]*?)<\/pre>/i', $html, $matches);

	foreach ($matches[0] as $k => $v)
	{
		$html = str_replace($v, md5($v), $html);
		$pre_cache[md5($v)] = $v;
	}

	// remove style
	preg_match_all('/<style([\\w\\W]*?)<\/style>/i', $html, $matches);

	foreach ($matches[0] as $k => $v)
	{
		$html = str_replace($v, md5($v), $html);
		$pre_css[md5($v)] = $v;
	}

	// remove script
	preg_match_all('/<script([\\w\\W]*?)<\/script>/i', $html, $matches);

	foreach ($matches[0] as $k => $v)
	{
		$html = str_replace($v, md5($v), $html);
		$pre_script[md5($v)] = $v;
	}

	// remove tags
	preg_match_all('/<(.*?)>/i', $html, $tag_cache);

	foreach ($tag_cache[1] as $k => $v)
	{
		$html = str_replace($tag_cache[0][$k], '<'.md5($v).'>', $html);
		$full_cache['<'.md5($v).'>'] = $tag_cache[0][$k];
	}

	// Blank
	$html = preg_replace('/(\s)+/i', "$1", $html);
	$html = preg_replace('/(\n?\A)\s+(?!\-)/i', "$1", $html);
	$html = preg_replace('/\s\z/i', "", $html);

	// Mdash
	$html = preg_replace('/(>|\A|\n)\-\s/i', "$1&mdash;&nbsp;", $html);

	// One-two words
	$html = preg_replace('/(?<![-:])\b([\w]{1,2}\b(?:[,:;]?))(?!\n)\s/i', "$1&nbsp;", $html);
	if ($lang == 'ru')
	{	
		$html = preg_replace('/(\s|&nbsp;)(же|ли|ль|бы|б|ж|ка)([\.,!\?:;])?&nbsp;/i', "&nbsp;$2$3 ", $html);
	}

	// Replace special characters
	$html = preg_replace('/·/i', "&bull;", $html);
	$html = preg_replace('/•/i', "&bull;", $html);

	$html = preg_replace('/«/i', "&laquo;", $html);
	$html = preg_replace('/»/i', "&raquo;", $html);

	$html = preg_replace('/\.{3}/i', "&hellip;", $html);
	$html = preg_replace('/\((c|с)\)/i', "&copy;", $html);

	$html = preg_replace('/\(r\)/i', '<sup><small>&reg;</small></sup>', $html);
	$html = preg_replace('/\(tm\)/i', '<sup><small>&trade;</small></sup>', $html);
	$html = preg_replace('/(\d+)(x|х)(\d+)/i', '$1&times;$3', $html);

	$html = preg_replace('/(\+\-|\-\+|\+\-)/i', '&plusmn;', $html);
	$html = preg_replace('/([ ]+|&nbsp;)\-\s+/i', '&nbsp;&mdash; ', $html);

	// Russian quotes
	if ($lang == 'ru')
	{
	   	$html = preg_replace('/(?<!\s)([!?]|&hellip;)?"(?!\b)/i', '$1&raquo;', $html);
		$html = preg_replace('/(?<!\b)"(?!\s)/i', '&laquo;', $html);
	}

	// Dash
	$html = preg_replace('/(?<!\-)(?=\b)(\w+)\-(\w+)(?<=\b)(?!\-)/i', '<span style="white-space: none;">$1-$2</span>', $html);

	if (isset($pre_cache)) foreach($pre_cache as $k => $v) $html = str_replace($k, $v, $html);
	if (isset($pre_css)) foreach($pre_css as $k => $v) $html = str_replace($k, $v, $html);
	if (isset($pre_script)) foreach($pre_script as $k => $v) $html = str_replace($k, $v, $html);

	// return tags
	if (isset($full_cache)) foreach($full_cache as $k => $v) $html = str_replace($k, $v, $html);

	return $html;
}

?>