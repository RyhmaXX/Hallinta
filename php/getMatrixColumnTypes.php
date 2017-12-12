<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"]["domain"])) {
			
			$query = $conn->prepare("SELECT id, type
					FROM input_type");
			
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {

				$id = $row["id"];
				$type = $row["type"];
				
				$a = array (
					"id" => $id,
					"type" => $type,
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["types"] = $arr;
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);

?>