<?php

include "../config.php";


if (isset($_GET['delete']))
{
	unlink(FILES_ROOT.$_GET['delete']);
	exit;
}
	
?>