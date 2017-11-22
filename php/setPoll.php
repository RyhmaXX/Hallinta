<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$name = $request->name;
			$start = $request->startdate;
			$end = $request->enddate;
			$status = $request->status;
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("INSERT INTO poll (name, domain, startdate, enddate, status)
									VALUES (?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?)
									ON DUPLICATE KEY UPDATE
									name = ?, startdate = ?, enddate = ?, status = ?");
									
			$query->bind_param("siiiisiii", $name, $domain, $start, $end, $status, $name, $start, $end, $status);
			if ($query->execute()) {
				// Success
				$resp["code"] = 0;
				$resp["id"] = $conn->insert_id;
				
			} else {
				// Error
				$resp["code"] = -1;
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