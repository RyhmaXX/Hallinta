app.controller("homeCtrl", function ($scope, $window, $http, $location){
	
	$scope.id = 0;
	
	$http.get("php/getPolls.php").then(function(response){
		if (response.data.code == 0) {
			$scope.polls = response.data.polls;
		} else if (response.data.code == 1) {
			$location.path("/home");
		} else {
			alert("error");
		}
	});
	
	$scope.saveId = function(id) {
		
			$scope.id = id;
		
	}
	
	$scope.publish = function() {
		
			if ($scope.id > 0){
				$http.post("php/publishPoll.php").then(function(response){
					if (response.data.code == 0) {
						alert("Kysely on julkaistu");
					}
					else {
						alert("error" + response.data.code);
					}
					$('#myModal').modal('hide');
				});
			}
			
			
		
	}
});