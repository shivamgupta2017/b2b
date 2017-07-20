"use strict";
//angular.module('starter.controllers', []).
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animaiton: 'slide-in-up'
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

  $scope.doLogin = function() {
   Services.webServiceCallPost($scope.loginData, 'test').then(function(response)
    {
      alert('shivam'+JSON.stringify(response));
    });
    
    

  };

});
app.controller('dashboardCtrl', function($scope, Services, Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage) 
{

  $localStorage.selected_items=[];

  Services.webServiceCallPost('', 'get_products').then(function(response)
    {
      $scope.data = response.data[0].data;
      console.log('shivam :'+JSON.stringify($scope.data));      
    });



  $ionicModal.fromTemplateUrl('templates/search.html', 
  {
    scope: $scope,
    animaiton: 'slide-in-up'
  }).then(function(modal) 
  {
    $scope.modal = modal;
  });
  $scope.search_model=function()
  {
    $scope.modal.show();
  }
  $scope.close_search_modal=function()
  {
    $scope.modal.hide();    
  }

  $scope.product_name_clicked=function(product_id)
  { 

    $scope.modal.hide();
    var extra_data={
    }
    extra_data.product_id=product_id;

    Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
    {
        if(response.data[1].response.status==1)
        {
          // $localStorage.selected_items.push(response.);          
        }
    });


  }




 /*UiServices.confirmation_popup('title','lassan').then(function(res){
    alert('res :'+res);
 });*/
  //Additional_services.show_alert('shivam','lassan');
 // UiServices.alert_popup('title','templates');
  
});

app.controller('PlaylistCtrl', function($scope, $stateParams) 
{
  alert('playlistctrl');
});
