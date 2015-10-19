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

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://skillsjobs.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

 
// Home controller
app.controller('LoginCtrl', ['$scope','$rootScope','$location','$firebaseAuth','Auth','$state',function($scope,$rootScope,$location,$firebaseAuth,Auth,$state
  ){

	var firebaseObj = new Firebase("https://skillsjobs.firebaseio.com");
	var loginObj = $firebaseAuth(firebaseObj); 
  $scope.authenticationData = firebaseObj.getAuth();

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
        
        $scope.auth = Auth;
        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function(authData) {
        $scope.authData = authData;
        });
        location.reload();
             
    }, function(error) {
        //Failure callback
        console.log('Authentication failure');
    });
   
             
	}

  $scope.logout = function() {
    $scope.auth = Auth;
    $scope.auth.$unauth(); 
    location.reload();
  }

}]);
    

