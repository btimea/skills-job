'use strict';
 
var app = angular.module('myApp.login', ['ui.router','firebase'])
 
// Declared route 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "signIn/signIn.html",
      controller: "LoginCtrl"
    })
    
}])

 
// Home controller
app.controller('LoginCtrl', ['$scope','$location','$firebaseAuth',function($scope,$location,$firebaseAuth, $state,Authorization
  ){


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
    // .finally(function(){
    //   Authorization.go('main'); 
    //   debugger;

    // });

               
	}

 
   
    

}]);