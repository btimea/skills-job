'use strict';
 
var app = angular.module('myApp.home', ['ui.router','firebase'])
 
// Declared route 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "home/home.html"
    })
    
}])
 