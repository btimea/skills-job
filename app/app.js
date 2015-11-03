 'use strict';
 
angular.module('myApp', [
    'ui.router',
    'angular-growl',
    'ngAnimate',
    'myApp.login',
    'myApp.main',
    'myApp.addArticle',
    'myApp.home',
    'myApp.regulament'
]).
config(['$urlRouterProvider','growlProvider', function($urlRouterProvider,growlProvider) {
    // Set defualt view of our app to home
   $urlRouterProvider.otherwise("/home");
   growlProvider.globalTimeToLive(200000);

}]);


// for ui-router
angular.module('myApp').run(["$rootScope", "$state", function($rootScope, $state) {
$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
  // We can catch the error thrown when the $requireAuth promise is rejected
  // and redirect the user back to the home page
  if (error === "AUTH_REQUIRED") {
    $state.go("home");
  }
});
}]);
