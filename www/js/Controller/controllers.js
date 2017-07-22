"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage, $rootScope, $state) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
$scope.$on('$ionicView.enter', function()
{
  $scope.user_data=$localStorage.user_data;
});
  
  


  $rootScope.constant_image_url=Constant.base_url.image_url;

  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
    
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };


   $scope.login = function() 
   {
        $scope.modal.show();
   };
   $scope.logout=function()
   {    

        $localStorage.user_data='';
        $scope.user_data='';
   }

  $scope.doLogin = function() {

   Services.webServiceCallPost($scope.loginData, 'login').then(function(response)
    {
      if(response.data[1].response.status==1)
      { 
        $scope.modal.hide();
        $scope.loginData={};
        $localStorage.user_data = response.data[0].data.id;
        $scope.user_data=$localStorage.user_data;
      }
    });
    
    

  };

});
app.controller('dashboardCtrl', function($scope, Services, Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage, $state) 
{
  //$localStorage.selected_items=[];
  $scope.selected_items = $localStorage.selected_items;

  

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
      product_id: product_id
    }
    

    Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
    {
        if(response.data[1].response.status==1)
        {          

          angular.forEach(response.data[0], function(value, key) 
          {
            var extra_data=
            {
              quantity: 1
            }
            angular.extend(value.product_details[0], extra_data);
          });

          $localStorage.selected_items.push(response.data[0].data);  
          $scope.selected_items = $localStorage.selected_items;
        }
    });


  }
  $scope.dQuantity=function(index, quantity)
  {
    if(quantity>1)
    $localStorage.selected_items[index].product_details[0].quantity = quantity-1;
  }
  $scope.aQuantity=function(index, quantity)
  {
    $localStorage.selected_items[index].product_details[0].quantity = quantity+1;
  }
  $scope.removeItem=function(index)
  { 
    $localStorage.selected_items.splice(index, 1);
  }
  $scope.save_order=function()
  {
      var req_obj={};
          req_obj.products=[];
          req_obj.user_id='7';
          angular.forEach($scope.selected_items, function(value, key) 
          {
              
              var extra_data=
              {
                product_id: value.product_details[0].product_id,
                quantity: value.product_details[0].quantity,
                unit_mapping_id: value.product_details[0].unit.unit_product_mapping_id
              }
              
              req_obj.products.push(extra_data);
          });
          
          alert('shivam :'+JSON.stringify(req_obj));
          Services.webServiceCallPost(req_obj, 'get_product_details').then(function(response)
          {
            alert();
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
