<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT user_id, area_id 
									FROM user_to_area 
									WHERE area_id IN (
										SELECT id 
										FROM area 
										WHERE lake_id IN (
											SELECT id
											FROM lake
											WHERE domain_id = ?
											)
									)");
									
			$query->bind_param("i", $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				$user = $row["user_id"];
				$area = $row["area_id"];
				
				if (isset($arr[$area])) {
					array_push($arr[$area], $user);
				} else {
					$arr[$area] = [];
					array_push($arr[$area], $user);
				}
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