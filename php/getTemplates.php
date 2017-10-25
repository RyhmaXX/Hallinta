<?php
	
	session_start();
	
	try {
	
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT id, name
									FROM poll
									WHERE status = 4 && domain = ?");
									
			$query->bind_param("i", $domain);
			$query->execute();
			
			$result = $query_>get_result();
			
			$templates = [];
			
			while ($row = $result->fetch_assoc()) {
				$id = $row["id"];
				$name = $row["name"];
				
				$template = array(
					"id" => $id,
					"name" => $name
				);
				
				array_push($templates, $template);
			}
			
			$resp["code"] = 0;
			$resp["templates"] = $templates;
			
		} else {
			$resp["code"] = 1;
		}
		
	} catch(Exception $e) {
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
	
?>