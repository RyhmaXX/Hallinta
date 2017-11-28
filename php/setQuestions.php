<?php
	
	session_start();
	
	function deletePreviousIfExists($conn, $poll) {
		
		$query = $conn->prepare("SELECT COUNT(poll_id) as count
								FROM question
								WHERE poll_id = ?");
		
		$query->bind_param("i", $poll);
		
		if ($query->execute()) {
			$result = $query->get_result();
			
			$row = $result->fetch_assoc();
			
			if ($row["count"] != 0) {
				$query = $conn->prepare("DELETE FROM question
										WHERE poll_id = ?");
										
				$query->bind_param("i", $poll);
				
				if ($query->execute()) {
					return true;
				}
			} else {
				return true;
			}
		}
		
		return false;
	}
	
	function setChoices($conn, $poll, $choices, $qnum) {

		$errors = 0;
		
		$query = $conn->prepare("INSERT INTO choice (num, name, question_poll_id, question_question_num)
								VALUES (?, ?, ?, ?)");
		
		foreach ($choices as $choise) {
			
			$query->bind_param("isii", $choise->num, $choise->name, $poll, $qnum);
			
			if ($query->execute()) {
				// ok
			} else {
				$errors++;
			}
		}
		
		return $errors;
	}
	
	function setRows($conn, $mid, $rows) {

		$errors = 0;
		
		$query = $conn->prepare("INSERT INTO qm_row (qm_id, num, title)
								VALUES (?, ?, ?)");
		
		foreach ($rows as $row) {
			
			$query->bind_param("iis", $mid, $row->num, $row->title);
			
			if ($query->execute()) {
				// ok
			} else {
				$errors++;
			}
		}
		
		return $errors;
	}
	
	function setColumns($conn, $mid, $cols) {

		$errors = 0;
		
		$query = $conn->prepare("INSERT INTO qm_column (qm_id, num, title, type)
								VALUES (?, ?, ?, ?)");
		
		foreach ($cols as $col) {
			
			$query->bind_param("iisi", $mid, $col->num, $col->title, $col->type);
			
			if ($query->execute()) {
				// ok
			} else {
				$errors++;
			}
		}
		
		return $errors;
	}
	
	function setMatrix($conn, $poll, $matrix, $qnum) {
		
		$errors = 0;
		
		$query = $conn->prepare("INSERT INTO question_matrix (poll_id, question_num, header)
								VALUES (?, ?, ?)");
								
		$query->bind_param("iis", $poll, $qnum, $matrix->header);
		
		if ($query->execute()) {
			$mid = $conn->insert_id;
			
			$errors += setRows($conn, $mid, $matrix->rows);
			$errors += setColumns($conn, $mid, $matrix->columns);
			
		} else {
			$errors++;
		}
		
		return $errors;
	}
	
	try {
		
		include("db.inc");
		
		$errors = 0;
		$resp = [];
		
		if (isset($_SESSION["user"]["domain"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$poll = $request->poll;
			
			if (deletePreviousIfExists($conn, $poll)) {
			
				$questions = $request->questions;
				
				$query = $conn->prepare("INSERT INTO question (question_num, poll_id, question, question_types_id)
										VALUES (?, ?, ?, ?)");

				foreach ($questions as $question) {
					$query->bind_param("iisi", $question[0], $poll, $question[1], $question[2]);
					if ($query->execute()) {
						// Success
						
						if ($question[2] > 99 && $question[2] < 200) {
							
							$errors += setChoices($conn, $poll, $question[3], $question[0]);
							
							$query = $conn->prepare("INSERT INTO question (question_num, poll_id, question, question_types_id)
										VALUES (?, ?, ?, ?)");
						} else if ($question[2] > 199) {
							
							$errors += setMatrix($conn, $poll, $question[3], $question[0]);
							
							$query = $conn->prepare("INSERT INTO question (question_num, poll_id, question, question_types_id)
										VALUES (?, ?, ?, ?)");
						}

					} else {
						// Error
						$errors++;
					}
				}
				
				$resp["code"] = 0;
				$resp["errors"] = $errors;
				
			} else {
				// Check failed
				$resp["code"] = -2;
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
