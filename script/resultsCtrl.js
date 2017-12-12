app.controller("resultsCtrl", function ($scope, $window, $http, $location){
	
	$scope.pollName = "";
	
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
	
	var fetchQuestionTypes = function() {
		
		$http.get("php/getQuestionTypes.php").then(function(response) {
			if (response.data.code == 0) {
				
				$scope.questionTypes = response.data.types;
			} else {
				alert("Kysymystyyppejä ei saatu noudettua!");
			}
		});
	};
	
	var getUserCount = function(id) {
		
		var data = {
			'poll' : id
		};
		
		$http.post("php/getUserCountInPoll.php", data).then(function(response){
			if (response.data.code == 0) {
				$scope.userCount = response.data.count;
			} else if (response.data.code == 1) {
				$location.path("/results");
			} else {
				alert("error");
			}
		});
	};
	
	var getNumericResultArray = function(qNumber) {
		
		var len = $scope.answers[qNumber].length;
		
		var answers = $scope.answers[qNumber];
		
		var returnArr = [];
		var max = 0;
		var min = 0;
		var avg = 0;
		var sum = 0;		
		
		for (var i = 0;  i < len; i++) {	

			var a = parseInt(answers[i]);
			
			if (i == 0) {
				min = a;
				max = a;
			} else {
				if (a > max) {
					max = a;
				} else if (a < min) {
					min = a;
				}
			}
			sum += a;
			
		}
		
		avg = sum / len;
		
		returnArr = [sum, avg, min, max];
		
		return returnArr;
	};
	
	var getChoiceResultArray = function(qNumber) {
		
		// Answer count
		var len = $scope.answers[qNumber].length;
		// Possible choices count
		var len2 = $scope.questions[qNumber - 1].extra.length
		
		var ChoiceArr = [];
		var returnArr = [];
		var kpl = 0;
		var pros = 0;
		
		// Kuinka monta valintaa
		for (var i = 0; i < len2; i++){
			ChoiceArr.push(0);
		}
		
		var answers = $scope.answers[qNumber];
		
		// Vastaukset
		for (var y = 0;  y < len; y++) {	
			if (answers[y] != null){
				ChoiceArr[parseInt(answers[y].substring(1, answers[y].length-1)) - 1] += 1;
			}
		}	
		
		//Tauluun pistäminen
		for (var x = 0;  x < len2; x++) {	
				
			kpl = ChoiceArr[x];
			pros = kpl / len * 100;
			returnArr.push([kpl, pros]);
		
		}

		return returnArr;
	};
	
	var getBooleanResultArray = function(qNumber) {
		
		var len = $scope.answers[qNumber].length;
		var answers = $scope.answers[qNumber];
		var returnArr = [];
		var pos = 0;
		var neg = 0;
		var pros = 0;
		
		
		for (var i = 0;  i < len; i++) {	
			if (answers[i] != null){
				if (answers[i] == "\"0\""){
					neg += 1;
				}
				else if(answers[i] == "\"1\""){
					pos += 1;
				}
			}
		}
		
		pros = pos / len * 100;
		returnArr.push([pos, pros]);
		pros = neg / len * 100;
		returnArr.push([neg, pros]);
		return returnArr;	
	};
	
	var getMultipleChoiceResultArray = function(qNumber) {
		
		var aCount = $scope.answers[qNumber].length;
		var cCount = $scope.questions[qNumber - 1].extra.length;
		
		var choiceArr = [];
		var nameArr = [];
		
		var answers = $scope.answers[qNumber];
		
		for (var i = 0; i < cCount; i++){
			choiceArr.push(0);
			nameArr.push($scope.questions[qNumber - 1].extra[i].name);
		}
		
		for (var j = 0; j < aCount; j++) {
			if (answers[j] != null){
				
				var obj = JSON.parse(answers[j]);
				
				for (var prop in obj) {
					if (obj[prop]) {
						for (var x = 0; x < cCount; x++) {
							if (nameArr[x] == prop) {
								choiceArr[x] += 1;
								x = cCount;
							}
						}
					}
				}
				
				//alert(answers[j][Object.keys(answers[j])]);
			}
		}
		
		var returnArr = [];
		
		for (var y = 0; y < cCount; y++) {
			returnArr.push([choiceArr[y], choiceArr[y] / aCount * 100]);
		}
		
		return returnArr;
	};
	
	var getColumnResults = function(num, matrix, column, type, rowCount) {
		
		var answers = JSON.parse("[" + $scope.answers[num] + "]");
		
		switch (type) {
			
			// null
			case 0:
				break;
			
			// Integer
			case 1:
			// Float
			case 2:

				var returnArr = [{"type":1}];
				
				for (var j = 0; j < rowCount; j++) {
					
					var max = 0;
					var min = 0;
					var avg = 0;
					var sum = 0;
					
					var rowArr = []
					
					for (var i = 0;  i < answers.length; i++) {
						
						var a = parseInt(answers[i][j][column]);
						
						if (i == 0) {
							min = a;
							max = a;
						} else {
							if (a > max) {
								max = a;
							} else if (a < min) {
								min = a;
							}
						}
						sum += a;
					}
					
					avg = sum / answers.length;
				
					rowArr = [sum, avg, min, max];
					
					returnArr.push(rowArr);
				}
				
				return returnArr;
				
			// Text
			case 3:
				
				var returnArr = [{"type":3}];
				
				for (var i = 0; i < rowCount; i ++) {
					
					var arr = [];
					
					for (var j = 0; j < answers[i].length; j++) {
						arr.push(answers[i][j][column]);
					}
					
					returnArr.push(arr);
				}
			
				return returnArr;
				
			// Boolean
			case 4:
				var returnArr = [{"type":4}];
				
				for (var i = 0;  i < rowCount; i++) {
					
					var pos = 0;
					var neg = 0;
					var pros = 0;
					
					for (var j = 0; j < answers[i].length; j++) {
						if (answers[i][j][column] != null){
							if (answers[i][j] == 0){
								neg += 1;
							}
							else if(answers[i][j] == 1){
								pos += 1;
							}
						}
					}
					
					pros = pos / answers[i].length * 100;
					returnArr.push([pos, pros]);
					pros = neg / answers[i].length * 100;
					returnArr.push([neg, pros]);
					
				}

				return returnArr;
		}
		
	};
	
	var getMatrixResultArray = function(qNumber) {
		
		var matrix = $scope.questions[qNumber - 1].extra;
		
		var rowCount = $scope.questions[qNumber - 1].extra.rows.length;
		var colCount = $scope.questions[qNumber - 1].extra.columns.length;
		
		var returnArr = [];
		
		for (var x = 0; x < colCount; x++) {
			var arr = getColumnResults(qNumber, matrix, x, matrix.columns[x].type, rowCount);
			returnArr.push(arr);
		}
		
		return returnArr;
	};
	
	var validateAnswers = function() {
		
		var answers = $scope.answers;

		for (var prop in answers) {
			
			var type = $scope.questions[parseInt(prop)-1].type;
			//alert(type);
			for (var j = 0; j < answers[prop].length; j++) {
				switch (type) {
			
					// Text
					case 1:
						if (answers[prop][j] == "null") {
							answers[prop].splice(j, 1);
						}
						break;
					
					// Numeric
					case 2:
						if (answers[prop][j] == "null") {
							answers[prop].splice(j, 1);
						}
						break;
					
					// Boolean
					case 3:

						if (answers[prop][j] == "null") {
							answers[prop].splice(j, 1);
						}
						break;
					
					// Choice
					case 100:
						if (answers[prop][j] == "null") {
							answers[prop].splice(j, 1);
						}
						break;
						
					// Multiple-choice
					case 101:
						break;
						
					case 201:

						var nulls = false;
						
						var a = JSON.parse(answers[prop][j]);
						for (var x = 0; x < a.length; x++) {
							//alert(a[x]);
							if (a[x] == "") {
								nulls = true;
								x = answers[prop][j].length;
							}
						}
						
						if (nulls) {
							answers[prop].splice(j, 1);
						}
						break;
				}
			}
		}
		
		$scope.answers = answers;
	};
	
	$scope.getResultArray = function(num, type) {
		
		$scope.resultArray = [];
		
		switch (type) {
			
			// Text
			case 1:
				break;
			
			// Numeric
			case 2:
				$scope.resultArray = getNumericResultArray(num);
				break;
			
			// Boolean
			case 3:
				$scope.resultArray = getBooleanResultArray(num);
				break;
			
			// Choice
			case 100:
				$scope.resultArray = getChoiceResultArray(num);
				break;
				
			// Multiple-choice
			case 101:
				$scope.resultArray = getMultipleChoiceResultArray(num);
				break;
				
			case 201:
				$scope.resultArray = getMatrixResultArray(num);
				break;
		}
	};
	
	$scope.getAnswersAndQuestions = function(id) {
		
		for (var i = 0; i < $scope.polls.length; i++) {
			if ($scope.polls[i].id == id) {
				$scope.pollName = $scope.polls[i].name;
				i = $scope.polls.length;
			}
		}
		
		getUserCount(id);
		
		var data = {
			'pollid' : id
		};
		
		$http.post("php/getTemplate.php", data).then(function(response){
			if (response.data.code == 0) {
				$scope.questions = response.data.questions;
			} else if (response.data.code == 1) {
				$location.path("/results");
			} else {
				alert("error");
			}
		});
		
		$http.post("php/getAnswers.php", data).then(function(response){
			if (response.data.code == 0) {
				$scope.answers = response.data.answers;
				validateAnswers();
			} else if (response.data.code == 1) {
				$location.path("/results");
			} else {
				alert("error");
			}
		});
	};
	
	$scope.getType = function(id) {

		var type = null;
		
		for (var i = 0; i < $scope.questionTypes.length; i++) {
			if ($scope.questionTypes[i].id == id) {
				type = $scope.questionTypes[i].name;
				i = $scope.questionTypes.length;
			}
		}
		
		return type;
	}
	
	$scope.getValidAnswers = function(num) {
		
		return $scope.answers[num].length;
	}
	
	fetchPolls();
	fetchQuestionTypes();
	
});
