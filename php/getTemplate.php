<?php
	
	session_start();
	
	function getChoices($conn, $type, $num, $pollid) {
		
		$query = $conn->prepare("SELECT num, name
								FROM choice
								WHERE question_poll_id = ? AND question_question_num = ?");
		
		$query->bind_param("ii", $pollid, $num);
		$query->execute();
		
		$result = $query->get_result();
		
		$extras = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$name = $row["name"];
			
			$extra = array(
				"num" => $num,
				"name" => $name
			);
			
			array_push($extras, $extra);
		}
		
		return $extras;
	}	
	
	function getMatrixRows($conn, $id) {
		
		$query = $conn->prepare("SELECT num, title
								FROM qm_row
								WHERE qm_id = ?
								ORDER BY num");
		
		$query->bind_param("i", $id);
		$query->execute();
		
		$result = $query->get_result();
		
		$rows = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$title = $row["title"];
			
			$r = array(
				"num" => $num,
				"title" => $title
			);
			
			array_push($rows, $r);
		}
		
		return $rows;
	}
	
	function getMatrixColumns($conn, $id) {
		
		$query = $conn->prepare("SELECT num, title, type
								FROM qm_column
								WHERE qm_id = ?
								ORDER BY num");
		
		$query->bind_param("i", $id);
		$query->execute();
		
		$result = $query->get_result();
		
		$columns = [];
		
		while ($row = $result->fetch_assoc()) {
			$num = $row["num"];
			$title = $row["title"];
			$type = $row["type"];
			
			$col = array(
				"num" => $num,
				"title" => $title,
				"type" => $type
			);
			
			array_push($columns, $col);
		}
		
		return $columns;
	}
	
	function getMatrix($conn, $type, $num, $pollid) {
		
		$query = $conn->prepare("SELECT id, header
								FROM question_matrix
								WHERE poll_id = ? AND question_num = ?");
		
		$query->bind_param("ii", $pollid, $num);
		$query->execute();
		
		$result = $query->get_result();
		
		$row = $result->fetch_assoc();
		
		$id = $row["id"];
		$header = $row["header"];
		
		$rows = getMatrixRows($conn, $id);
		$columns = getMatrixColumns($conn, $id);
		
		$matrix = array(
			"header" => $header,
			"rows" => $rows,
			"columns" => $columns
		);
		
		return $matrix;
	}
	
	try {
		
		include("db.inc");
		
		$resp = [];
		
		if (isset($_SESSION["user"])) {
			
			$postdata = file_get_contents("php://input");
			$request = json_decode($postdata);
			
			$pollid = $request->pollid;
			$domain = $_SESSION["user"]["domain"];
			
			$query = $conn->prepare("SELECT question_num, question, question_types_id
									FROM question
									WHERE poll_id = ?");
									
			$query->bind_param("i", $pollid);
			
			$query->execute();
			
			$result = $query->get_result();
			
			$questions = [];
			
			while ($row = $result->fetch_assoc()) {
				$num = $row["question_num"];
				$question = $row["question"];
				$type = $row["question_types_id"];
				
				if ($type > 99 && $type < 200) {
					
					$extra = getChoices($conn, $type, $num, $pollid);
					
					$question = array(
						"num" => $num,
						"question" => $question,
						"type" => $type,
						"extra" => $extra
					);
					
				} else if ($type > 199) {
					
					$extra = getMatrix($conn, $type, $num, $pollid);
					
					$question = array(
						"num" => $num,
						"question" => $question,
						"type" => $type,
						"extra" => $extra
					);
					
				} else {
					
					$question = array(
						"num" => $num,
						"question" => $question,
						"type" => $type,
						"extra" => null
					);
				}
				
				array_push($questions, $question);
			}
			
			$resp["code"] = 0;
			$resp["questions"] = $questions;
			
		} else {
			// Not loggedquestion in
			$resp["code"] = 1;
		}
	} catch (Exception $e){
		$resp = [];
		$resp["code"] = -1;
	}
	
	echo json_encode($resp);
?>