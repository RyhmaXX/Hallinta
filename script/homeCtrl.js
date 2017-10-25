app.controller("homeCtrl", function ($scope, $window, $http, $location){
	
	$http.get("php/getPolls.php").then(function(response){
		if (response.data.code == 0) {
			$scope.polls = response.data.polls;
		} else if (response.data.code == 1) {
			$location.path("/home");
		} else {
			alert("error");
		}
	});
});