var app = angular.module("mainApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html",
		controller : "loginCtrl"
    })
    .when("/new", {
        templateUrl : "newQuery.html"
    })
    .when("/results", {
        templateUrl : "results.html"
    })
	.when("/home", {
        templateUrl : "home.html"
    })
    .when("/settings", {
        templateUrl : "settings.html"
    });
});