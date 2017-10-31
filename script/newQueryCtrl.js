app.controller("newQueryCtrl", function ($scope, $window, $http, $location){
	
	$scope.name = "";
	$scope.startdate = new Date();
	$scope.enddate = new Date();
	$scope.skipdate = false;
	$scope.skiptemplate = false;
	$scope.selectedtemplate = "";
	$scope.selectedUsers = "";
	$scope.selectedLake = "";
	
	
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
	
	$scope.saveEventInfo = function() {
		if ($scope.skipdate == false){
			if ($scope.selectedtemplate != "---Ei pohjaa---" && $scope.selectedtemplate != ""){
				var data = {
					'name' : $scope.name,
					'startdate' : Math.floor($scope.startdate.getTime() / 1000),
					'enddate' : Math.floor($scope.enddate.getTime() / 1000),
					'status' : 1,
					'selectedtemplate' : $scope.selectedtemplate
				};
			}
		}
		else {
			if ($scope.selectedtemplate == "---Ei pohjaa---"){
				var data = {
					'name' : $scope.name,
					'startdate' : null,
					'enddate' : null,
					'status' : 1
					
				};
			}
		}
		
		$http.post("php/setPoll.php", data).then(function(response){
			if (response.data.code == 0) {
				$location.path("/home");
			} else {
				alert("error: " + response.data.code);
			}
		});
		
		var data = {
			'id' : $scope.selectedLake
		};
		
		$http.post("php/getAreasByLake.php", data).then(function(response){
			if (response.data.code == 0) {
				$scope.areas = response.data.areas;
				/* ribs aivot */
			} else {
				alert("error: " + response.data.code);
			}
		});
		
	};
	
	$scope.check = function() {
		if ($scope.skipdate == false){
			if ($scope.name != "" && $scope.enddate > $scope.startdate) {
				$scope.ok = true;
			} else {
				$scope.ok = false;
			}
		}
		else if($scope.skipdate == true && $scope.name != ""){
		  $scope.ok = true;
		  
	  }
	};
});