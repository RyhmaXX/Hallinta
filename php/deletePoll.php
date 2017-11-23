<?php
	session_start();
	
	try {
		
		include("db.inc");
		
		if (isset($_SESSION["user"])) {
			
			$resp = [];
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			$id = $request->id;
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("DELETE FROM poll
									WHERE domain = ? AND id = ?");
									
			$query->bind_param("ii", $domain, $id);
			
			if ($query->execute()) {
				$resp["code"] = 0;
			} else {
				$resp["code"] = 2;
			}
		}
		
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);
?>
