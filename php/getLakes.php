<?php
	// Placeholder
	session_start();
	
	$resp = [];
	
	$resp["code"] = 0;
	$resp["lakes"] = ["Järvi 1", "järvi 2", "järvi 3"];
	
	echo json_encode($resp);

?>