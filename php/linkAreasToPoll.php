<?php
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		$resp["code"] = 0;
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$areas = $request->areas;
			$poll = $request->poll;
			$domain = $_SESSION["user"]["domain"];
			
			// TO DO Optimize!
			
			$query = $conn->prepare("INSERT INTO polls (area_id, poll_id) VALUES (?, ?)");
			
			foreach ($areas as $area) {
				
				$query->bind_param("ii", $area, $poll);
				
				if (!($query->execute())) {
					// error
					$resp["code"] = 2;
				}
			}
		} else {
			// Not logged in
			$resp["code"] = 1;
		}
	} catch (Exception $e){
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>