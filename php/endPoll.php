<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		
		$poll = $request->poll;
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("UPDATE poll
									SET status = 3
									WHERE id = ? AND domain = ? AND status = 2");
			
			$query->bind_param("iii", $poll, $domain);
			
			if ($query->execute()) {
				
				$resp["code"] = 0;
				
			} else {
				$resp["code"] = -2;
			}
			
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);
?>