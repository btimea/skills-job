'use strict';
 
var app = angular.module('myApp.addArticle', ['ui.router',"firebase"])
 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('addArticle', {
      url: "/editare",
      templateUrl: "addArticle/addArticle.html",
      controller: "AddArticleCtrl",
      data: {
	      authorization: true,
	      redirectTo: 'login'
      }
    })
    
}])
 
app.controller('AddArticleCtrl',function($scope,$firebaseArray) {
   
    var ref = new Firebase("https://skillsjobs.firebaseio.com/Articles");
	$scope.adaugare = $firebaseArray(ref);
	$scope.article = {};
	$scope.AddArticle = function() {
	 	$scope.adaugare.$add({
	       	id: $scope.article.id,
			data: $scope.article.data,
			nume: $scope.article.nume,
			sex: $scope.article.sex,
			varsta: $scope.article.varsta,
			clasa: $scope.article.clasa,
			scoala: $scope.article.scoala,
			judet: $scope.article.judet,
			mediu: $scope.article.mediu,
			cnp: $scope.article.cnp,
			email: $scope.article.email
	    });
	     	
	}

});