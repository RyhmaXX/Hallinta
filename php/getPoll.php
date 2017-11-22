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
			
			$query = $conn->prepare("SELECT poll.name as name, poll.startdate as start, poll.enddate as end, poll_status.name as status
					FROM poll
					INNER JOIN poll_status ON poll.status = poll_status.id
					WHERE poll.domain = ? AND poll.id = ?");
					
			$query->bind_param("ii", $domain, $id);
			$query->execute();
			
			$result = $query->get_result();
			
			if (mysqli_num_rows($result) != 1) {
				$resp["code"] = -2;
				
			} else {
				$row = $result->fetch_assoc();
				
				$name = $row["name"];
				$start = strtotime($row["start"]);
				$end = strtotime($row["end"]);
				$status = $row["status"];
				
				$poll = array (
					"id" => $id,
					"name" => $name,
					"start" => $start,
					"end" => $end,
					"status" => $status
				);
				
				$resp["code"] = 0;
				$resp["poll"] = $poll;
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
