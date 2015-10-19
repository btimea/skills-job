'use strict';
 
var app = angular.module('myApp.main', ['ui.router',"firebase",'ngSanitize', 'ngCsv','ngResource','angular-growl','ngAnimate'])

 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "main/main.html",
      controller: "MainCtrl",
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireAuth();

        }]
      }
      
    })
    
}])
 
 
app.controller('MainCtrl', ['$scope','$rootScope','$firebaseObject','$firebaseArray','$http','growl','$state', function($scope,$rootScope,$firebaseObject,$firebaseArray,$http,growl,$state) {
  
  var ref = new Firebase("https://skillsjobs.firebaseio.com/Articles");
  $scope.data = $firebaseObject(ref);
  var ref2 = new Firebase("https://skillsjobs.firebaseio.com/Castigatori");
  $scope.castigatori = $firebaseArray(ref2);

  $scope.judete = ["Bihor","Bistrita-Nasaud","Cluj","Hunedoara","Maramures","Salaj","Timis"];
  $scope.search = {}; 
  $scope.scoliAlese = [];
 

  $http.get('main/scoli.json').success(function(data) {
    $scope.dataSc = data;
  });


  $scope.$watch('search.judet', function (newValue, oldValue) {
    if (newValue !== undefined && newValue !== oldValue) {
      $scope.selectScoala();
    }
  });

 
  $scope.selectScoala = function (){
    $scope.scoli = [];
    $scope.dataSc.forEach(function(item){
      if(item.judet === $scope.search.judet)
       $scope.scoli.push(item.scoala);
    });

  }
   
  $scope.getHeader = function () {
    return ["CNP","Clasa", "Data", "Email", "Grup", "Id", "Judet", "Mediu","Nume","Scoala","Sex","Varsta","Ord"]
  };


   $scope.getHeaderCastigatoriTotal = function () {
    return ["Judet","Nume","Ord","Scoala"]
  };

    $scope.getHeaderCastigatori = function () {
    return ["Judet","Nume","Ord","Scoala"]
  };

  $scope.filterIt = function (i){
    $scope.winnersData = [];

    if ($scope.scoliAlese.indexOf(i) <=-1){
      $scope.scoliAlese.push(i);

      $scope.loading = true;
      setTimeout(function(){
        $scope.data.$loaded()
          .then(function() {
            $scope.elevi = $scope.data;
            $scope.filtered = [];
            $scope.idList = [];
           
          

            $scope.elevi.forEach(function(item){
              $scope.test =item.scoala.toUpperCase();

              if (item.judet === $scope.search.judet &&  item.scoala.toUpperCase() === $scope.search.scoala.toUpperCase()) {
                $scope.filtered.push(item);
                $scope.idList.push(item.id);
              }
            });

            $scope.winnersId = $scope.shuffle($scope.idList).slice(0,3);

            $scope.filtered.forEach(function(item){
              $scope.winnersId.forEach(function(winId){
                if(item.id === winId){
                  $scope.winnersData.push(item);          
                }
              })
            })


            for(var i=0;i < $scope.winnersData.length;i++){
              $scope.winnersData[i].idOrd = i+1;
            }

            return $scope.winnersData;

        })
         
           .finally(function () {
              // Hide loading spinner whether our call succeeded or failed.
              $scope.winnersData.forEach(function(item){
                  $scope.castigatori.$add({
                    idOrd:item.idOrd,
                    nume: item.nume,
                    scoala: item.scoala,
                    judet: item.judet
                  });    
                })

              $scope.loading = false;
              growl.addSuccessMessage("Extragerea a fost efectuata cu succes");
             
            });
        
      }, 3000) 


    }

    else {
      growl.addErrorMessage("Extragerea aferente acestei scoli a fost deja efectuata" + '\n' + "Va rugam selectati alta scoala");
    }

  }
 



  $scope.ShowAllWinners = function(){
    $scope.listAllWinners=[];
      $scope.castigatori.forEach(function(item,index){
          if (item.judet === $scope.search.judet && item.scoala.toUpperCase() === $scope.search.scoala.toUpperCase()) {
            $scope.listAllWinners.push(item);
           
          }
      });

      for(var i=0;i < $scope.listAllWinners.length;i++){
        $scope.listAllWinners[i].idOrd = i+1;
      }
       return $scope.listAllWinners;
  }  

 
  $scope.shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

	
}]);

