'use strict';
 
var app = angular.module('myApp.regulament', ['ui.router',"firebase",'ngSanitize', 'ngCsv','ngResource'])

 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('regulament', {
      url: "/regulament",
      templateUrl: "regulament/regulament.html"
    })
    
}])