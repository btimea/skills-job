'use strict';
 
var app = angular.module('myApp.main', ['ui.router',"firebase",'ngSanitize', 'ngCsv','ngResource'])

 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "main/main.html",
      controller: "MainCtrl",
      data: {
        authorization: true,
        redirectTo: 'login'
      }
    })
    
}])
 
 
app.controller('MainCtrl', ['$scope','$firebaseObject','$firebaseArray','$http', function($scope,$firebaseObject,$firebaseArray,$http) {
  
  var ref = new Firebase("https://skillsjobs.firebaseio.com/Articles");
  $scope.data = $firebaseObject(ref);
  var ref2 = new Firebase("https://skillsjobs.firebaseio.com/Castigatori");
  $scope.castigatori = $firebaseArray(ref2);

  $scope.judete = ["Bihor","Bistrita-Nasaud","Cluj","Hundedoara","Maramures","Salaj","Timis"];
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
    return ["CNP","Clasa", "Data", "Email", "Grup", "Id", "Judet", "Mediu","Nume","Scoala","Sex","Varsta"]
  };


   $scope.getHeaderCastigatori = function () {
    return ["Nume","Scoala","Judet"]
  };


  


  $scope.filterIt = function (i){
    if ($scope.scoliAlese.indexOf(i) <=-1){
      $scope.scoliAlese.push(i);

      $scope.loading = true;
      setTimeout(function(){
        $scope.data.$loaded()
          .then(function() {
            $scope.elevi = $scope.data;
            $scope.filtered = [];
            $scope.idList = [];
            $scope.winnersData =[];
          

            $scope.elevi.forEach(function(item){
              if (item.judet === $scope.search.judet && item.scoala === $scope.search.scoala) {
                $scope.filtered.push(item);
                $scope.idList.push(item.id);
              }
            });

            $scope.winnersId = $scope.shuffle($scope.idList).slice(4,7);

            $scope.filtered.forEach(function(item){
              $scope.winnersId.forEach(function(winId){
                if(item.id === winId){
                  $scope.winnersData.push(item);          
                }
              })
            })

            return $scope.winnersData;

        })
         
           .finally(function () {
              // Hide loading spinner whether our call succeeded or failed.
              $scope.winnersData.forEach(function(item){
                  $scope.castigatori.$add({
                    nume: item.nume,
                    scoala: item.scoala,
                    judet: item.judet
                  });    
                })

              $scope.loading = false;

            });
        
      }, 3000) 


    }

    else {
      alert("Extragerea a fost deja efectuata")
    }

  }


  $scope.ShowAllWinners = function(){
    $scope.listAllWinners=[];
     $scope.castigatori.forEach(function(item){
          if (item.judet === $scope.search.judet && item.scoala === $scope.search.scoala) {
            $scope.listAllWinners.push(item);
          }
        });
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

