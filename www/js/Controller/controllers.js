"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage, $rootScope, $state) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


$scope.$on('$ionicView.enter', function()
{
  $scope.user_data=$localStorage.user_data;
});
  
      $ionicModal.fromTemplateUrl('templates/login.html', 
      {
          scope: $scope
      }).then(function(modal) 
      {
        $scope.modal = modal;
      });
      $ionicModal.fromTemplateUrl('templates/raise_my_concern.html', 
      {
          scope: $scope
      }).then(function(modal) 
      {
        $scope.raise_concern_model = modal;
      });

  $rootScope.constant_image_url=Constant.base_url.image_url;

  $scope.loginData = {};
  
  $scope.raise_my_concern=function()
  {
    
    $scope.raise_concern_model.show();

  }
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.close_raise_concern_model = function() {
    $scope.raise_concern_model.hide();
  };
  $scope.recent_orders=function()
  {
    $state.go('app.recent_orders');
  }

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


   UiServices.show_loader();  

  if($localStorage.selected_items==undefined)
    $localStorage.selected_items=[];

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
    
    if(angular.isUndefined($localStorage.user_data))
    {
      var req_obj=
      {
        user_id: '7',
        delivery_date: '2017-7-22'        
      };
    }
    else
    {
      var req_obj=
      {
        user_id: $localStorage.user_data,
        delivery_date: '2017-7-22'        
      };

    }
          req_obj.order_products=[];
          angular.forEach($scope.selected_items, function(value, key) 
          {
              
              var extra_data=
              {
                product_id: value.product_details[0].product_id,
                quantity: value.product_details[0].quantity,
                unit_mapping_id: value.product_details[0].unit.unit_product_mapping_id
              }
              
              req_obj.order_products.push(extra_data);
          });
          alert('shviam :'+JSON.stringify(req_obj));
          Services.webServiceCallPost(req_obj, 'create_order').then(function(response)
          {
            alert('res :'+JSON.stringify(response));
            $localStorage.selected_items=[];
          });
  }





 /*UiServices.confirmation_popup('title','lassan').then(function(res){
    alert('res :'+res);
 });*/
  //Additional_services.show_alert('shivam','lassan');
 // UiServices.alert_popup('title','templates');
  
});
app.controller('recent_ordersCtrl', function(Services, $scope, $state){

    var req_data={
      user_id: '7'
    };
   
    Services.webServiceCallPost(req_data, 'get_orders').then(function(response)
    {
      if(response.data[1].response.status==1)
      {
        $scope.recent_orders_data=response.data[0].data;
      }
    });

    $scope.get_order_details=function(order_id, user_id)
    {
      $state.go('app.view_order_details', {order_id: order_id});
    }

});
app.controller('view_order_detailsCtrl', function($scope, $stateParams, Services) 
{
    var sending_data={order_id: $stateParams.order_id};
      Services.webServiceCallPost(sending_data, 'get_order_details').then(function(response)
      {
          if(response.data[1].response.status==1)
          {
            $scope.order_details=response.data[0].data;
          }
      });
});

