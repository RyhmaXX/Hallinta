<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT id, fname, lname, zip 
									FROM user 
									WHERE domain = ?");
			$query->bind_param("i", $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				
				$id = $row["id"];
				$fname = $row["fname"];
				$lname = $row["lname"];
				$zip = $row["zip"];

				$a = array (
					"id" => $id,
					"name" => $lname . ", " . $fname,
					"zip" => $zip,
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["users"] = $arr;
			
		} else {
			
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);
?>