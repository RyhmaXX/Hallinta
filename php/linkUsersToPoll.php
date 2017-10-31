<?php
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		$resp["code"] = 0;
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$users = $request->users;
			$poll = $request->poll;
			$domain = $_SESSION["user"]["domain"];
			
			// TO DO Optimize!
			
			$query = $conn->prepare("INSERT INTO user_to_poll (user_id, poll_id) VALUES (?, ?)");
			
			foreach ($users as $user) {
			
				$query->bind_param("ii", $user, $poll);
				
				if (!($query->execute())) {
					// error
					$resp["code"] = 2;
				}
			}
			
		} else {
			// Not logget in
			$resp["code"] = 1;
		}
	} catch (Exception $e){
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>