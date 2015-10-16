 'use strict';
 
angular.module('myApp', [
    'ngRoute',
    'myApp.home',
    'myApp.main',
    'myApp.addArticle'
]).
config(['$routeProvider', function($routeProvider) {
    // Set defualt view of our app to home
     
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}]);