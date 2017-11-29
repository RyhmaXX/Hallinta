app.controller("homeCtrl", function ($scope, $window, $http, $location){
	
	$scope.id = 0;
	$scope.startdate = null;
	$scope.enddate = null;
	$scope.adddate = false;
	
	var fetchPolls = function() {
		$http.get("php/getPolls.php").then(function(response){
			if (response.data.code == 0) {
				$scope.polls = response.data.polls;
			} else if (response.data.code == 1) {
				$location.path("/home");
			} else {
				alert("error");
			}
		});
	};
	
	$scope.fetchPoll = function(id) {
		$scope.ok = false;
		var data = {
			'id' : id
		};
		
		$http.post("php/getPoll.php", data).then(function(response){
			if (response.data.code == 0) {			
				$scope.name = response.data.poll.name;
				$scope.id = id;
					if (response.data.poll.start != null && response.data.poll.start != null){
						$scope.adddate = true;
						$scope.startdate = new Date(response.data.poll.start*1000);
						$scope.enddate = new Date(response.data.poll.end*1000);
					}
					else{
						$scope.startdate = null;
						$scope.enddate = null;
						$scope.adddate = false;		
					}
			} else if (response.data.code == 1) {
				$location.path("/home");
			} else {
				alert("error");
			}
		});
	};	
	
	$scope.fetchTemplate = function(id) {
		$scope.ok = false;
		var data = {
			'pollid' : id
		};
		$http.post("php/getTemplate.php", data).then(function(response){
			if (response.data.code == 0) {
				$scope.id = id;
				$scope.questions = response.data.questions;	
				
				$scope.questionsStatus = [];
				
				for (var i = 0; i < $scope.questions.length; i++) {
					$scope.questionsStatus.push("true");
				}
				
			} else if (response.data.code == 1) {
				$location.path("/home");
			} else {
				alert("error");
			}
		});
	};	
	
	$scope.saveId = function(id) {
		
			$scope.id = id;
		
	}
	
	$scope.publish = function() {
		
		if ($scope.id > 0){
			
			var data = {
				'id' : $scope.id
			};
			
			$http.post("php/publishPoll.php", data).then(function(response){
				if (response.data.code == 0) {
					alert("Kysely on julkaistu");
				}
				else {
					alert("error" + response.data.code);
				}
				fetchPolls();
				$('#publishModal').modal('hide');
			});
		}
	}
	
	$scope.deletePoll = function() {
		
		if ($scope.id > 0){
			
			var data = {
				'id' : $scope.id
			};
			
			$http.post("php/deletePoll.php", data).then(function(response){
				if (response.data.code == 0) {
					alert("Kysely on poistettu");
				}
				else {
					alert("error" + response.data.code);
				}
				fetchPolls();
				$('#deleteModal').modal('hide');
			});
		}
	}
	
	$scope.edit = function() {
		
		if ($scope.id > 0){
			if ($scope.adddate == true){
			var data = {
				'id' : $scope.id,
				'name' : $scope.name,
				'startdate' : Math.floor($scope.startdate.getTime() / 1000),
				'enddate' : Math.floor($scope.enddate.getTime() / 1000)
			};
			}
			else{
				var data = {
					'id' : $scope.id,
					'name' : $scope.name,
					'startdate' : null,
					'enddate' : null
				};
			}
			$http.post("php/updatePoll.php", data).then(function(response){
				if (response.data.code == 0) {
					alert("Kysely on päivitetty");
				}
				else {
					alert("error" + response.data.code);
				}
				fetchPolls();
				$('#editModal').modal('hide');
			});
			
		}
		else{
			alert("Kyselyä ei valittuna");
		}
	};

	$scope.saveQuestions = function() {
		
		// Kysymysten päivitys
		var questions = [];

		var len = $scope.questions.length;

		for (var i = 0;  i < len; i++) {
			questions.push([$scope.questions[i].num, $scope.questions[i].question, $scope.questions[i].type, $scope.questions[i].extra]);
		}

		var data = {
			'poll' : $scope.id,
			'questions' : questions
		};

		$http.post("php/setQuestions.php", data).then(function(response) {
			if (response.data.code != 0) {
				alert("Virhe kysymysten lähettämisessä!");
				
			}
			fetchPolls();
			$('#editQuestionsModal').modal('hide');
		});
	};
	
	$scope.check = function() {
	
		fetchPolls();

		if ($scope.adddate == true){
			if ($scope.name != "" && $scope.enddate > $scope.startdate) {
				$scope.ok = true;
			} else {
				$scope.ok = false;
			}
		}
		else if($scope.adddate == false && $scope.name != ""){
		  $scope.ok = true;
		  
		}
		else {
			$scope.ok = false;
		}
	};	

	var fetchQuestionTypes = function() {
		
		$http.get("php/getQuestionTypes.php").then(function(response) {
			if (response.data.code == 0) {
				
				$scope.questionTypes = response.data.types;
			} else {
				alert("Kysymystyyppejä ei saatu noudettua!");
			}
		});
	};
	
	var fetchMatrixColumnTypes = function() {
		
		$http.get("php/getMatrixColumnTypes.php").then(function(response) {
			
			if (response.data.code == 0) {
				
				$scope.matrixInputTypes = response.data.types;
				
			} else {
				alert("Matriisityyppejä ei saatu noudettua!");
			}
		});
	};
	
	$scope.addQuestion = function() {
		
		var len = $scope.questions.length;
		var uusikysymys = {
			'num' : len + 1,
			'question' : "",
			'type' : 1,
			'extra' : null				
		};
		
		$scope.questions.push(uusikysymys);
		$scope.checkQuestions();
	}
	
	$scope.refreshQuestionNumbers = function() {
	
		var len = $scope.questions.length;
		
		for (var i = 0;  i < len; i++) {
			$scope.questions[i].num = i + 1;
		}		
	};
	
	$scope.deleteQuestion = function(id) {
		
		$scope.questions.splice(id-1,1);
	
		$scope.refreshQuestionNumbers();
	};
	
	$scope.addChoice = function(id) {
		
		var len = $scope.questions[id-1].extra.length;
		
		var uusivalinta = {
			'num' : len + 1,
			'name' : ""			
		};		
		
		$scope.questions[id-1].extra.push(uusivalinta);				
	};
	
	$scope.deleteChoice = function(id, choiceNum) {
		
		$scope.questions[id-1].extra.splice(choiceNum-1,1);
		
		$scope.refreshChoice(id);
	};
	
	$scope.refreshChoice = function(id) {
		
		var len = $scope.questions[id-1].extra.length;
		
		for (var i = 0;  i < len; i++) {
			$scope.questions[id-1].extra[i].num = i + 1;
		}			
	
	};
	
	$scope.addColumn = function(id) {
		
		var len = $scope.questions[id-1].extra.columns.length;
		var uusisarake = {
			'num' : len,
			'title' : "",
			'type' : 0
		};			
		$scope.questions[id-1].extra.columns.push(uusisarake);				
	};
		
	$scope.addRow = function(id) {
		
		var len = $scope.questions[id-1].extra.rows.length;
		var uusirivi = {
			'num' : len,
			'title' : ""
		};			
		$scope.questions[id-1].extra.rows.push(uusirivi);				
	};
	
	$scope.deleteColumn = function(id, columnNum) {
		
		$scope.questions[id-1].extra.columns.splice(columnNum,1);
		
		$scope.refreshColumn(id);
	};
	
	$scope.deleteRow = function(id, rowNum) {
		
		$scope.questions[id-1].extra.rows.splice(rowNum,1);
		
		$scope.refreshRow(id);
	};
	
	$scope.refreshColumn = function(id) {
		
		var len = $scope.questions[id-1].extra.columns.length;
		
		for (var i = 0;  i < len; i++) {
			$scope.questions[id-1].extra.columns[i].num = i;
		}			
	
	};
	
	$scope.refreshRow = function(id) {
	
		var len = $scope.questions[id-1].extra.rows.length;
		
		for (var i = 0;  i < len; i++) {
			$scope.questions[id-1].extra.rows[i].num = i;
		}			
	
	};
	
	$scope.checkQuestions = function() {

		var ok = true;
		
		var len = $scope.questions.length;
		
		for (var i = 0;  i < len; i++) {
			
			var currentOk = true;
			
			if ($scope.questions[i].question == "") {
				currentOk = false;
			}

			if ($scope.questions[i].type < 100) {
				// simple question
				if ($scope.questions[i].extra != null) {
					currentOk = false;
				}
				
			} else if ($scope.questions[i].type > 99 && $scope.questions[i].type < 200) {
				// choice question
				if ($scope.questions[i].extra.length < 1) {
					currentOk = false;

				} else {
					var elen = $scope.questions[i].extra.length;
		
					for (var j = 0;  j < elen; j++) {
						if ($scope.questions[i].extra[j].name == "") {
							currentOk = false;

							break;
						}
					}	
				}
				
			} else if ($scope.questions[i].type > 199) {
				// matrix question
				if ($scope.questions[i].extra.rows.length < 1) {
					currentOk = false;

				} else {
					var elen = $scope.questions[i].extra.rows.length;
		
					for (var j = 0;  j < elen; j++) {
						if ($scope.questions[i].extra.rows[j].title == "") {
							currentOk = false;

							break;
						}
					}	
				}
				
				if ($scope.questions[i].extra.columns.length < 1) {
					currentOk = false;

				} else {
					var elen = $scope.questions[i].extra.columns.length;
		
					for (var j = 0;  j < elen; j++) {
						if ($scope.questions[i].extra.columns[j].title == "") {
							currentOk = false;

							break;
						}
					}	
				}
			}
			
			if (currentOk) {
				$scope.questionsStatus[i] = true;
			} else {
				$scope.questionsStatus[i] = false;
				ok = false
			}
		}

		if (ok) {
			$scope.ok = true;
		} else {
			$scope.ok = false;
		}
	};
	
	$scope.changeQuestionType = function(question) {
		
		if (question.type < 100) {
			// Simple
			question.extra = null;
		} else if (question.type > 99 && question.type < 200) {
			// Choice
			question.extra = [];
		} else if (question.type > 199) {
			// Matrix
			question.extra = {
				"header": "",
				"rows": [],
				"columns": []
			};
		}
		
		$scope.checkQuestions();
	};
	
	$scope.moveQuestion = function(up, num) {
		if (up) {
			if (num > 1) {
				var temp = $scope.questions[num - 1];
				$scope.questions[num - 1] = $scope.questions[num - 2];
				$scope.questions[num - 2] = temp;
			} else {
				alert("error");
			}
			
		} else {
			if (num < $scope.questions.length) {
				var temp = $scope.questions[num - 1];
				$scope.questions[num - 1] = $scope.questions[num];
				$scope.questions[num] = temp;
			} else {
				alert("error");
			}
		}
		
		$scope.refreshQuestionNumbers();
	};
	
	fetchQuestionTypes();
	fetchMatrixColumnTypes();
	fetchPolls();
});
