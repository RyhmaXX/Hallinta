<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT id, name
					FROM lake
					WHERE domain_id = ?");
			$query->bind_param("i", $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				$id = $row["id"];
				$name = $row["name"];

				$a = array (
					"id" => $id,
					"name" => $name,
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["lakes"] = $arr;
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);

?>