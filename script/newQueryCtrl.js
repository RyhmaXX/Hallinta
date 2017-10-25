app.controller("newQueryCtrl", function ($scope, $window, $http){
	
	$scope.name = "";
	$scope.startdate = new Date();
	$scope.enddate = new Date();
	$scope.skipdate = false;
	
	$scope.saveEventInfo = function() {
		if ($scope.skipdate == false){
		var data = {
			'name' : $scope.name,
			'startdate' : Math.floor($scope.startdate.getTime() / 1000),
			'enddate' : Math.floor($scope.enddatedate.getTime() / 1000),
			'status' : 1
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
		//$http.post("php/setPoll.php", data);
		
		$location.path('/home');
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