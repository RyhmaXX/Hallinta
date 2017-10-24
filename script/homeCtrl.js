app.controller("homeCtrl", function ($scope, $window, $http){
	
	$http.get("php/getPolls.php").then(function(response){
		$scope.polls = response.data;
	});
});