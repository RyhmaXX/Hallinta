app.controller("loginCtrl", function ($scope, $window, $http){
	
	$scope.ktunnus = "";
	$scope.salasana = "";
	$scope.virhe = true;
	
	$scope.kirjaudu = function() {
	

	
	var data = {
		'kt' : $scope.ktunnus,
		'salasana' : $scope.salasana
	};
	
	$http.post("php/login.php", data).then(function(response){
		if (response.code == 0){
			$window.location.href = "#/home";
		}
		else{
			$scope.error = "Virheellinen kirjautuminen";
			$scope.virhe = false;
		}			
	});
	
	};
	
});
 