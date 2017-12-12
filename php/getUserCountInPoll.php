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
			
			$query = $conn->prepare("SELECT COUNT(user_id) as count
									FROM user_to_poll
									WHERE poll_id = ? AND poll_id IN(
										SELECT id
										FROM poll
										WHERE domain = ?)");
			
			$query->bind_param("ii", $poll, $domain);
			if ($query->execute()) {
				$result = $query->get_result();
			
				$row = $result->fetch_assoc();
				
				$resp["code"] = 0;
				$resp["count"] = $row["count"];
				
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