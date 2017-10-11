<?php

session_start();

$resp = [];

if (isset($_SESSION["user"])) {
	$resp["code"] = 1;
} else {
	$resp["code"] = 0;
}

echo json_encode($resp);

?>