app.controller("newQueryCtrl", function ($scope, $window, $http, $location){
	
	$scope.name = "";
	$scope.startdate = new Date();
	$scope.enddate = new Date();
	$scope.adddate = false;
	$scope.skiptemplate = false;
	$scope.selectedtemplate = 0;
	$scope.selectedLake = 0;
	
	
	$http.get("php/getLakes.php").then(function(response){
		if (response.data.code == 0) {
			$scope.lakes = response.data.lakes;
		} else if (response.data.code == 1) {
			$location.path("/new");
		} else {
			alert("error: " + response.data.code);
		}
	});
	
	$http.get("php/getUsersByAreas.php").then(function(response){
		if (response.data.code == 0) {
			$scope.users = response.data.users;
		} else if (response.data.code == 1) {
			$location.path("/new");
		} else {
			alert("error: " + response.data.code);
		}
	});
	
	$http.get("php/getTemplates.php").then(function(response){
		if (response.data.code == 0) {
			$scope.templates = response.data.templates;
		} else if (response.data.code == 1) {
			$location.path("/new");
		} else {
			alert("error: " + response.data.code);
		}
	});
	
	/* Testi funktio
	$scope.testi = function() {

				alert($scope.selectedLake);
				
		};
	*/
	
	// Save poll to database
	$scope.saveEventInfo = function() {
		if ($scope.skipdate == false){
			var data = {
				'name' : $scope.name,
				'startdate' : Math.floor($scope.startdate.getTime() / 1000),
				'enddate' : Math.floor($scope.enddate.getTime() / 1000),
				'status' : 1,
			};
		}
		else {

			var data = {
				'name' : $scope.name,
				'startdate' : null,
				'enddate' : null,
				'status' : 1
			};

		}
		
		// Save basic info
		$http.post("php/setPoll.php", data).then(function(response){
			if (response.data.code == 0) {
				
				var id = response.data.id;
				
				// Link users if needed
				if ($scope.selectedLake != 0) {
					var data = {
						'id' : $scope.selectedLake
					};
					
					$http.post("php/getAreasByLake.php", data).then(function(response){
						if (response.data.code == 0) {
							$scope.areas = response.data.areas;
							
							var len = $scope.areas.length;
							
							// $scope.areas alueet tyylillä: [1, 2]
							// $scope.users käyttäjät alueittain
							var usersToLink = [];
							
							for (var i = 0; i < len; i++) {
								try {
									for (var j = 0; j < $scope.users[$scope.areas[i]].length; j++) {
										
										if (usersToLink.indexOf($scope.users[$scope.areas[i]][j]) == -1) {
											usersToLink.push($scope.users[$scope.areas[i]][j]);
										}
									}
								} catch(err) {
									
								}
							}
							
							alert(id);
							
							var data = {
								'users' : usersToLink,
								'poll' : id
							};
							
							$http.post("php/linkUsersToPoll.php", data).then(function(response) {
								if (response.data.code != 0) {
									alert("Virhe vastaajien liittämisessä! " + response.data.code);
								}
							});
							
						} else {
							alert("error: " + response.data.code);
						}
					});
				}
				
				// Apply template if needed
				if ($scope.selectedtemplate != 0) {
					var data = {
						'pollid' : $scope.selectedtemplate
					};
					
					$http.post("php/getTemplate.php", data).then(function(response){
						if (response.data.code == 0) {
							
							var questions = [];
							
							var len = response.data.questions.length;
							
							for (var i = 0;  i < len; i++) {
								questions.push([response.data.questions[i].num, response.data.questions[i].question, response.data.questions[i].type, response.data.questions[i].extra]);
							}
							
							var data = {
								'poll' : id,
								'questions' : questions
							}
							
							$http.post("php/setQuestions.php", data).then(function(response) {
								if (response.data.code != 0) {
									alert("Virhe templaten käyttöönotossa!");
								}
							});
							
						} else {
							alert("error: " + response.data.code);
						}
					});
				}
			} else {
				alert("error: " + response.data.code);
			}
		});
		
		$location.path("/home");

	};
	
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
	};
});