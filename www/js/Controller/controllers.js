"use strict";

//angular.module('starter.controllers', []).
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the 



  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
   };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

app.controller('dashboardCtrl', function($scope, Services, Constant, UiServices, Additional_services, $filter) 
{



//  $filter('ItemsFilter')('sfsf');

  //alert('shivam :'+Constant.base_url.service_url);
  /*Services.webServiceCallPost('','').then(function()
  {
  });
  */
  
 /*UiServices.confirmation_popup('title','lassan').then(function(res){

    alert('res :'+res);

 });*/
  
  //Additional_services.show_alert('shivam','lassan');

 // UiServices.alert_popup('title','templates');

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];





});

app.controller('PlaylistCtrl', function($scope, $stateParams) 
{
  alert('playlistctrl');
});
