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
 
 
app.controller('MainCtrl', ['$scope','$rootScope','$firebaseObject','$firebaseArray','$timeout','$http','growl','$state','$q', function($scope,$rootScope,$firebaseObject,$firebaseArray,$timeout,$http,growl,$state,$q) {
  
  var ref = new Firebase("https://skillsjobs.firebaseio.com/Articles");
  $scope.data = $firebaseObject(ref);

  var ref2 = new Firebase("https://skillsjobs.firebaseio.com/Castigatori");
  $scope.castigatori = $firebaseArray(ref2);

  var ref3 = new Firebase("https://skillsjobs.firebaseio.com/Scoliextr");
  $scope.scoliextr = $firebaseArray(ref3);

  $scope.judete = ["Bihor","Bistrita-Nasaud","Cluj","Hunedoara","Maramures","Salaj","Timis"];
  $scope.search = {}; 
  $scope.scoliAlese = [];
  $scope.accesExtragere = false;
  $scope.accesValidare = false;
  $scope.obiect = {};
 

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
    return ["Ord","Judet","Nume","Scoala"]
  };

  $scope.getHeaderCastigatori = function () {
    return ["Ord","Judet","Nume","Scoala"]
  };

  $scope.validareElevi = function (){
    $scope.eleviPerScoala = []; 

    $scope.data.$loaded()
    .then(function() {
      $scope.totalElevi = $scope.data;

      $scope.totalElevi.forEach(function(item){
        if (item.judet === $scope.search.judet &&  item.scoala.toUpperCase() === $scope.search.scoala.toUpperCase()) {
          $scope.eleviPerScoala.push(item);  
        }
      });

    })
    .finally(function () {
       $scope.accesValidare = true;
    })  
  }

  $scope.startExtragere= function(){
    $scope.accesExtragere = true;
  }

  $scope.filterIt = function (i){
    $scope.winnersData = [];
    var scoliextrPromise;
   
    scoliextrPromise =  $scope.scoliextr.$loaded()
    .then(function(e) {
      $scope.scoliNeExtr= false;
      $scope.scoliextr.forEach(function(item){
        if (item.scoalaExtrasa === $scope.search.scoala && item.judetExtras === $scope.search.judet){
          $scope.scoliNeExtr=true;
        }
       }) 
    });
         
    scoliextrPromise.then(function(){
      if( $scope.scoliNeExtr == false){
        $scope.scoliextr.$add({
          scoalaExtrasa: $scope.search.scoala,
          judetExtras: $scope.search.judet
        });
      }
    })


    
    scoliextrPromise.then(function(){
      if($scope.scoliNeExtr==false)  {
       
        // var countUp = function (){
          $scope.data.$loaded()
            .then(function() {
              $scope.elevi = $scope.data;
              $scope.eleviFiltrati = [];
              $scope.idList = [];
             
          
              $scope.elevi.forEach(function(item){
                if (item.judet === $scope.search.judet &&  item.scoala.toUpperCase() === $scope.search.scoala.toUpperCase()) {
                  $scope.eleviFiltrati.push(item);
                  $scope.idList.push(item.id);
                }
              });
              
      
              var x1 = document.getElementById("afisare1");
              var s1 = [];
              $scope.eleviFiltrati.forEach(function(item){
                s1.push(item.nume);
              })
              var i = 0;
               
              (function loop() {
                  x1.innerHTML = s1[i];
                   if(i >= s1.length-1){
                    i = 0;
                  }
                  if (++i < s1.length) {
                      setTimeout(loop, 100);
                     
                  }
              })();

              var x2 = document.getElementById("afisare2");
              var s2 = [];
              $scope.eleviFiltrati.forEach(function(item){
                s2.push(item.nume);
              })
              var j = s1.length-1;
               
              (function loop() {
                  x2.innerHTML = s2[j];
                  if(j <= 0){
                    j = s1.length-1;;
                  }
                  if (--j > 0) {
                      setTimeout(loop, 100);
                      
                  }
              })();
   

              var x3 = document.getElementById("afisare3");
              var s3 = [];
              $scope.eleviFiltrati.forEach(function(item){
                s3.push(item.nume);
              })
              var t = 3;
               
              (function loop() {
                  x3.innerHTML = s3[t];
                  if(t >= s3.length-1){
                    t = 3;
                  }
                  if (++t < s3.length) {
                      setTimeout(loop, 100);
                      
                  }
              })();

              $scope.afisaj = true; 

              // var timpAfisare = function() {
              //   $scope.afisaj = false;
              //  } 
              // $timeout(timpAfisare,3000);
  

              $scope.winnersId = $scope.shuffle($scope.idList).slice(0,3);

              $scope.eleviFiltrati.forEach(function(item){
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

               var timpAfisare = function() {
                $scope.afisaj = false;
               } 
              $timeout(timpAfisare,3000);
              
           
             growl.success("Extragerea a fost efectuata cu succes");
              $scope.search.scoala = {};
              $scope.search.judet = {};
             
          });
          
        //}
        // $timeout(countUp, 1000);

      } 

      else {

        growl.error("Extragerea aferente acestei scoli a fost deja efectuata. Va rugam selectati alta scoala");
      }

    })
  
  }



  

  $scope.ShowWinners = function(){
    $scope.listAllWinners=[];
      $scope.castigatori.forEach(function(item){
          if (item.judet === $scope.search.judet && item.scoala.toUpperCase() === $scope.search.scoala.toUpperCase()) {
            $scope.listAllWinners.push(item);
          }
      });

      for(var i=0;i < $scope.listAllWinners.length;i++){
        $scope.listAllWinners[i].idOrd = i+1;
      }

       return $scope.listAllWinners;
  } 

  $scope.ShowAllWinners = function(){
    return $scope.castigatori
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

