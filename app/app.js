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
   growlProvider.globalTimeToLive(3000);

}]);




// angular.module('myApp').run(function($rootScope, $state, Authorization) {
 
//   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
//     if (!Authorization.authorized) {
//       if (Authorization.memorizedState && (!_.has(fromState, 'data.redirectTo') || toState.name !== fromState.data.redirectTo)) {
//         Authorization.clear();
//       }
//       if (_.has(toState, 'data.authorization') && _.has(toState, 'data.redirectTo')) {
//         if (_.has(toState, 'data.memory')) {
//           Authorization.memorizedState = toState.name;
//         }
//         $state.go(toState.data.redirectTo);
//       }
//     }

//   });

//   $rootScope.onLogout = function() {
//     Authorization.clear();
//     $state.go('home');
//   };

//    $rootScope.onLogin = function() {
//         Authorization.go('private');
//       };

// })

// angular.module('myApp').service('Authorization', function($state) {

//   this.authorized = false,
//   this.memorizedState = null;

//   var
//   clear = function() {
//     this.authorized = false;
//     this.memorizedState = null;
//   },

//   go = function(fallback) {
//     this.authorized = true;
//     var targetState = this.memorizedState ? this.memorizedState : fallback;
//     $state.go(targetState);
//   };

//   return {
//     authorized: this.authorized,
//     memorizedState: this.memorizedState,
//     clear: clear,
//     go: go
//   };
// });