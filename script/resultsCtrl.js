app.controller("resultsCtrl", function ($scope, $window, $http, $location){
	
		
	
		var fetchAnswers = function() {
		$http.get("php/getAnswers.php").then(function(response){
			if (response.data.code == 0) {
				$scope.results = response.data.polls;
			} else if (response.data.code == 1) {
				$location.path("/results");
			} else {
				alert("error");
			}
		});
	};
	

});
