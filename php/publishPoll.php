<?php

	session_start();

	try {
		
		include("db.inc");

		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);

		$id = $request->id;
		
		$domain = $_SESSION["user"]["domain"];
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			$query = $conn->prepare("UPDATE poll 
									SET status = 2
									WHERE id=? AND domain=?");
			$query->bind_param("ii", $id, $domain);
			$query->execute();
			
			$affected = $conn->affected_rows;
			
			if ($affected == 1) {
				$resp["code"] = 0;
			} else {
				$resp["code"] = 2;
				$resp["affected"] = $affected;
			}
			
		} else {
			// Not logged in error
			$resp["code"] = 1;
		}

	} catch (Exception $e) {
		// Unknown php-error
		$resp = [];
		$resp["code"] = -1;
	}

	echo json_encode($resp);

?>
