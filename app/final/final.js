'use strict';
 
var app = angular.module('myApp.final', ['ui.router',"firebase",'ngSanitize', 'ngCsv','ngResource','angular-growl','ngAnimate'])

 
.config(['$stateProvider', function($stateProvider) {

   $stateProvider
    .state('final', {
      url: "/final",
      templateUrl: "final/final.html",
      controller: "FinalCtrl",
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireAuth();

        }]
      }
      
    })
    
}])
 
 
app.controller('FinalCtrl', ['$scope','$rootScope','$firebaseObject','$firebaseArray','$timeout','$http','growl','$state','$q', function($scope,$rootScope,$firebaseObject,$firebaseArray,$timeout,$http,growl,$state,$q) {
  
 
  var ref2 = new Firebase("https://skillsjobs.firebaseio.com/Castigatori");
  $scope.castigatori = $firebaseArray(ref2);

  var ref3 = new Firebase("https://skillsjobs.firebaseio.com/JudeteExtr");
  $scope.judeteExtr = $firebaseArray(ref3);

  var ref1 = new Firebase("https://skillsjobs.firebaseio.com/Finalisti");
  $scope.finalisti = $firebaseArray(ref1);

  
  $scope.judete = ["Bihor","Bistrita-Nasaud","Cluj","Hunedoara","Maramures","Salaj","Timis"];
  $scope.search = {}; 
  $scope.scoliAlese = [];
  $scope.accesExtragere = false;
  $scope.accesValidare = false;
  $scope.startExportare = false;
  $scope.obiect = {};
  var premii=['Premiul III - 800 lei','Premiul II - 1000 lei','Premiul I - 1500 lei']
 

  $http.get('main/scoli.json').success(function(data) {
    $scope.dataSc = data;
  });

 

   $scope.headerCastigatoriPerJudet = function () {
    return ["Clasa","CNP", "Data", "Email","Id unic JVIS","Judet","Nume si Prenume","Premiul","Scoala","Varsta","Id identificare"]
  };

  $scope.ListareFinalisti = function () {
    return ["Clasa","Email","Id unic JVIS","Judet","Nume si Prenume","Premiul Nou","Premiul Vechi","Scoala","Varsta"]
  };

   $scope.getHeaderFinalisti = function () {
    return ["Clasa","CNP", "Data", "Email","Id unic JVIS","Judet","Nume si Prenume","Premiul Vechi","Scoala","Varsta","Id identificare","null","Idord", "Premiul Nou"]
  };

  $scope.validareCastigatori = function (){
    $scope.castigatoriPerJudet = []; 

    $scope.castigatori.$loaded()
    .then(function() {
      $scope.totalCastigatori = $scope.castigatori;
      $scope.totalCastigatori.forEach(function(item){
        if (item.judet === $scope.search.judet ) {
          $scope.castigatoriPerJudet.push(item); 
         
        }
      });

    })
    .finally(function () {
       $scope.accesValidare = true;
    })  
  }

  $scope.startExport= function(){
    $scope.startExportare = true;
  }

   $scope.startExtragere= function(){
    $scope.accesExtragere = true;
  }

  $scope.extrFinalisti = function (){
    $scope.dateFinalisti = [];
    var judeteExtrPromise;
   
    judeteExtrPromise =  $scope.judeteExtr.$loaded()
    .then(function(e) {
      $scope.judetNeExtr = false;
      $scope.judeteExtr.forEach(function(item){
       
        if (item.judetExtras === $scope.search.judet){
          $scope.judetNeExtr=true;
        }
       }) 
    });
         
    judeteExtrPromise.then(function(){
      if( $scope.judetNeExtr == false){
        $scope.judeteExtr.$add({
          judetExtras: $scope.search.judet
        });
      }
    })


    
    judeteExtrPromise.then(function(){
      if($scope.judetNeExtr==false)  {
          $scope.castigatori.$loaded()
            .then(function() {
              $scope.eleviCastigatori = $scope.castigatori;
              $scope.castigatoriFinali = [];
              $scope.idList = [];
             
          
              $scope.eleviCastigatori.forEach(function(item){
                if (item.judet === $scope.search.judet) {
                  $scope.castigatoriFinali.push(item);
                  $scope.idList.push(item.id);
                }
              });
              
      
              var x1 = document.getElementById("afisare1");
              var s1 = [];
              $scope.castigatoriFinali.forEach(function(item){
                s1.push(item.nume);
              })
              var i = 0;
               
              (function loop() {
                  x1.innerHTML = s1[i];
                   if(i >= s1.length-1){
                    i = 0;
                  }
                  if (++i < s1.length) {
                      $timeout(loop, 100);
                     
                  }
              })();

              var x2 = document.getElementById("afisare2");
              var s2 = [];
              $scope.castigatoriFinali.forEach(function(item){
                s2.push(item.nume);
              })
              var j = s2.length-1;
               
              (function loop() {
                  x2.innerHTML = s2[j];
                  if(j <= 0){
                    j = s2.length-1;
                  }
                  if (j-- >= 0) {
                      $timeout(loop, 100);
                      
                  }
              })();
   

              var x3 = document.getElementById("afisare3");
              var s3 = [];
              $scope.castigatoriFinali.forEach(function(item){
                s3.push(item.nume);
              })
              var t = 3;
               
              (function loop() {
                  x3.innerHTML = s3[t];
                  if(t >= s3.length-1){
                    t = 3;
                  }
                  if (++t < s3.length) {
                      $timeout(loop, 100);
                      
                  }
              })();

              $scope.afisaj = true;
              $scope.sunet =true; 

               var timpAfisare = function() {
                 $scope.afisaj = false;
                } 
                
              $timeout(timpAfisare,5000);
             
              $scope.finalistiId = $scope.shuffle($scope.idList).slice(0,3);

              $scope.castigatoriFinali.forEach(function(item){
                $scope.finalistiId.forEach(function(winId){
                  if(item.id === winId){
                    $scope.dateFinalisti.push(item);          
                  }
                })
              })

              for(var i=0;i < $scope.dateFinalisti.length;i++){
                $scope.dateFinalisti[i].idOrd = $scope.dateFinalisti.length-i ;
                $scope.dateFinalisti[i].premiulNou = premii[i] ;
              }

              return $scope.dateFinalisti;

          })//then sigur
           
          .finally(function () {
              // Hide loading spinner whether our call succeeded or failed.
            $scope.dateFinalisti.forEach(function(item){
                $scope.finalisti.$add({
                  premiul:item.premiulNou,
                  premiul_vechi:item.premiul,
                  nume: item.nume,
                  email:item.email,
                  clasa:item.clasa,
                  id:item.id,
                  varsta:item.varsta,
                  scoala: item.scoala,
                  judet: item.judet
                });    
            })



             growl.success("Extragerea a fost efectuata cu succes");

                      
          }); //finally  
       
      } //if

      else {
       
          // growl.error("Extragerea aferente acestei scoli a fost deja efectuata. Va rugam selectati alta scoala");
          alert("Extragerea aferente acestui judet a fost deja efectuata. Va rugam selectati alta scoala");   
      }

    })//then
  
  }


  $scope.ShowFinalists = function(){
    $scope.listAllFinalists=[];
    $scope.finalisti.forEach(function(item){
        if (item.judet === $scope.search.judet) {
          $scope.listAllFinalists.push(item);
        }
    });

      
       return $scope.listAllFinalists;
  } 

  $scope.ShowAllFinalists = function(){
    console.log($scope.finalisti);
    return $scope.finalisti;
  } 

  $scope.refresh = function (){
     location.reload();
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

