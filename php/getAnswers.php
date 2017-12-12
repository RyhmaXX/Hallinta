<?php
	
	session_start();
	
	try {
	
		include("db.inc");
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata);
		
		$poll = $request->poll;
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT answer, question_id
									FROM answer
									WHERE question_poll_id = ? AND question_poll_id IN (
										SELECT id
										FROM poll
										WHERE domain = ?)");
						
			$query->bind_param("ii", $poll, $domain);
			$query->execute();
			
			$result = $query->get_result();
			
			$answers = [];
			
			while ($row = $result->fetch_assoc()) {
				$question = $row["question_id"];
				$answer = $row["answer"];
				
				if (isset($answers[$question])) {
					array_push($answers[$question], $answer);
				} else {
					$answers[$question] = [$answer];
				}
			}
			
			$resp["code"] = 0;
			$resp["answers"] = $answers;
			
		} else {
			$resp["code"] = 1;
		}
		
	} catch(Exception $e) {
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>