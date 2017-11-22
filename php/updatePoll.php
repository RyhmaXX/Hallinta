<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$id = $request->id;
			$name = $request->name;
			$start = $request->startdate;
			$end = $request->enddate;
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("UPDATE poll
									SET name = ?, startdate = ?, enddate = ?
									WHERE id = ? AND domain = ? AND status = 1");
									
			$query->bind_param("siiii", $name, $start, $end, $id, $domain);
			if ($query->execute()) {
				// Success
				$resp["code"] = 0;
				
			} else {
				// Error
				$resp["code"] = -1;
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