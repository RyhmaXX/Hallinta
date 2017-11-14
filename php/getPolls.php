<?php

	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT poll.id as id, poll.name as name, poll.startdate as start, poll.enddate as end, poll_status.name as status
					FROM poll
					INNER JOIN poll_status ON poll.status = poll_status.id
					WHERE domain = ? && status != 10
					ORDER BY poll.status");
			$query->bind_param("i", $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$arr = [];
			
			while ($row = $result->fetch_assoc()) {

				$id = $row["id"];
				$name = $row["name"];
				$start = $row["start"];
				$end = $row["end"];
				$status = $row["status"];
				
				$a = array (
					"id" => $id,
					"name" => $name,
					"start" => $start,
					"end" => $end,
					"status" => $status
				);
				
				array_push($arr, $a);
			}
			
			$resp["code"] = 0;
			$resp["polls"] = $arr;
			
		} else {
			$resp["code"] = 1;
			
		}
	
	} catch(Exception $e) {
		
		$resp = [];
		$resp["code"] = -1;
		
	}
	
	echo json_encode($resp);

?>