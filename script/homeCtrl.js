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
				$scope.questions = response.data.questions;	
				//alert($scope.questions[0].num);
			} else if (response.data.code == 1) {
				$location.path("/home");
			} else {
				alert("error");
			}
		});
	};	
	
	fetchPolls();
	
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
	
	$scope.deleteQuestion = function(id) {
		
			// Kysymyksen poistaminen
			//$scope.questions[id].num = null;

		}
		
		
	
	
	$scope.delete = function() {
		
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
			
				//----- Kysymysten päivittäminen -----//
			var questions = [];
							
			var len = $scope.questions.length;
							
			for (var i = 0;  i < len; i++) {
				questions.push([$scope.questions[i].num, $scope.questions[i].question, $scope.questions[i].type, $scope.questions[i].extra]);
			}
							
			var data = {
				'poll' : $scope.id,
				'questions' : questions
				}
							
			$http.post("php/setQuestions.php", data).then(function(response) {
				if (response.data.code != 0) {
					alert("Virhe kysymysten lähettämisessä!");
					}
			});
			
			
		}
		else{
			alert("Kyselyä ei valittuna");
		}	
			
		
		
	}

	$scope.check = function() {
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
});
