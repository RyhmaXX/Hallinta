<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$pollid = $request->pollid;
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT question_num, question, question_types_id
									FROM poll
									WHERE poll_id = ?");
									
			$query->bind_param("i", $pollid);
			
			$query->execute();
			
			$result = $query->get_result();
			
			$questions = [];
			
			while ($row = $result->fetch_assoc()) {
				$num = $row["question_num"];
				$question = $row["question"];
				$type = $row["question_types_id"];
				
				$question = array(
					"num" => $num,
					"question" => $question,
					"type" => $type
				);
				
				array_push($questions, $question);
			}
			
			$resp["code"] = 0;
			$resp["questions"] = $arr;
			
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