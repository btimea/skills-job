'use strict';
 
var app = angular.module('myApp.home', ['ngRoute','firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])
 
 
// Home controller
app.controller('HomeCtrl', ['$scope','$location','$firebaseAuth',function($scope,$location,$firebaseAuth) {


	var firebaseObj = new Firebase("https://skillsjobs.firebaseio.com/");
	var loginObj = $firebaseAuth(firebaseObj); 

	$scope.SignIn = function(e) {
    e.preventDefault();
    var username = $scope.user.email;
    var password = $scope.user.password;
    loginObj.$authWithPassword({
            email: username,
            password: password
        })
        .then(function(user) {
           $location.path('/main');
            console.log('Authentication successful');
        }, function(error) {
            //Failure callback
            console.log('Authentication failure');
        });
	}

}]);


