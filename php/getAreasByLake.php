<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);

			$lake = $request->id;
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT id
									FROM area 
									WHERE lake_id = ? AND lake_id IN (
										SELECT id 
										FROM lake 
										WHERE domain_id = ?
									)
									)");
									
			$query->bind_param("ii", $lake, $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {
				$area = $row["id"];
	
					array_push($arr, $area);
				}
			}
			
			$resp["code"] = 0;
			$resp["areas"] = $arr;
			
		} else {
			
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);
	
?>