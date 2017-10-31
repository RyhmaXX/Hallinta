<?php
	
	session_start();
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"]["domain"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$poll = $request->poll;
			$questions = $request->questions;
			
			$query = $conn->prepare("INSERT INTO question (question_num, poll_id, question, question_types_id)
									VALUES (?, ?, ?, ?)");
			
			$num = 1;
			
			foreach ($question in $questions) {
				$query->bind_param("iiii", $num, $poll, $question[0], $question[1])
				if ($query->execute()) {
					// Success
					$resp["code"] = 0;
				} else {
					// Error
					$resp["code"] = -1;
				}
				$num++;
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
