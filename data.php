<?php 
	$id = md5($_SERVER['REMOTE_ADDR']);
	$log = $id . ' ' . $_POST['data'] . ' ' . PHP_EOL;

	file_put_contents('./results.log', $log, FILE_APPEND);

	echo $log;
?>
