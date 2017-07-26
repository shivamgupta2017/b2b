"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage, $rootScope, $state, $cordovaDatePicker) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

$scope.$on('$ionicView.enter', function()
{
  $scope.user_data=$localStorage.user_data;

});
  
      
      $ionicModal.fromTemplateUrl('templates/raise_my_concern.html', 
      {
          scope: $scope
      }).then(function(modal) 
      {
        $scope.raise_concern_model = modal;
      });

  $rootScope.constant_image_url=Constant.base_url.image_url;

  $scope.login = function() 
   {
      $state.go('app.login');
   }  

   $scope.logout=function()
   {    
        
        $localStorage.user_data='';
        $scope.user_data='';
   }
  
  $scope.raise_my_concern=function()
  {
    
    $scope.raise_concern_model.show();

  }
 
  $scope.close_raise_concern_model = function() 
  {
    $scope.raise_concern_model.hide();
  };
  $scope.recent_orders=function()
  {
    $state.go('app.recent_orders');
  }

    
  $scope.test=function()
  {
      
  }

});
app.controller('dashboardCtrl', function($scope, Services,$timeout,  Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage, $state, $cordovaDatePicker, $q, $ionicPopup)  
{
    



  if($localStorage.selected_items==undefined)
  {
    $localStorage.selected_items=[];
  }
  $scope.selected_items = $localStorage.selected_items;
    UiServices.show_loader(); 
    Services.webServiceCallPost('', 'get_products').then(function(response)
    {
      $scope.data = response.data[0].data;
       UiServices.hide_loader(); 
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
    $timeout(function()
      {
        document.getElementById('focuskaro').focus();
      },1000);
    
  }
  $scope.close_search_modal=function()
  {
      
      $scope.modal.hide();    
  }

  $scope.product_name_clicked=function(product_id)
  { 

    
          var check_index = -1;
          angular.forEach($localStorage.selected_items, function(value, key){
          if(value.product_details[0].product_id===product_id)
          {
           check_index=0;
          }
      });
    $scope.modal.hide();
    var extra_data={
      product_id: product_id
    }


   if(check_index==-1)
   {
    UiServices.show_loader(); 
    Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
    {
        if(response.data[1].response.status==1)
        {          
            var extra_data=
            {
             quantity: 1,
             final_price: 0
            }

          angular.extend(response.data[0].data.product_details[0], extra_data);
          $scope.temp=[];
          $scope.temp.push(response.data[0].data);
          angular.forEach($localStorage.selected_items, function(value, key) 
          {
            $scope.temp.push(value);
          });


          $localStorage.selected_items=$scope.temp;
          $scope.selected_items = $localStorage.selected_items;
          UiServices.hide_loader(); 
        }
    });

   }
  }
  $scope.dQuantity=function(index, quantity)
  {
    if(quantity>1)
    {
      $localStorage.selected_items[index].product_details[0].quantity = quantity-1;
      $scope.show_total(index);
    }
  }
  $scope.aQuantity=function(index, quantity)
  {
    $localStorage.selected_items[index].product_details[0].quantity = quantity+1;
    $scope.show_total(index);
  }
  $scope.removeItem=function(index)
  { 
    $localStorage.selected_items.splice(index, 1);
    $scope.total=0;
    angular.forEach($localStorage.selected_items, function(value, key)
    {
      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    });

   
    
  }
  $scope.open_date_picker=function()
  {
      var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      minDate: new Date() - 10000,
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };


    $cordovaDatePicker.show(options).then(function(date)
    { 
        $scope.save_order(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate());         
          
    });
  }
  $scope.save_order=function(date)
  {
    alert('shivam :'+$scope.total);
    if($localStorage.user_data=='')
    {
      $sate.go('app.login');
    }
    else
    {

      var req_obj=
      {
        user_id: $localStorage.user_data,
        delivery_date: '2017-7-25'        
      };
    


      req_obj.order_products=[];
      var total=0;


      angular.forEach($scope.selected_items, function(value, key) 
      {
          var extra_data=
          {
            product_id: value.product_details[0].product_id,
            quantity: value.product_details[0].quantity,
            unit_mapping_id: value.product_details[0].unit.unit_product_mapping_id,
            product_unit: value.product_details[0].unit.unit
          }

              req_obj.order_products.push(extra_data);
      });

              var confirmPopup = $ionicPopup.confirm({
                 title: 'Create Order Confirmation',
                 template: '<center>Are you sure?</center>'
              }).then(function(res) 
              

              {
                
                 if(res) 
                 {
                    Services.webServiceCallPost(req_obj, 'create_order').then(function(response)
                    {
                         alert('res :'+JSON.stringify(response));
                         $localStorage.selected_items=[];
                         var div='Your Order has been placed successfully, will place your order by your order date, we hope to have you again';
                          UiServices.alert_popup(div);  
                    });  
                 } 
                 else 
                 {
                    alert('Ls');
                 }
              });
    
      }

     
    }
      $ionicModal.fromTemplateUrl('templates/order_details.html', 
      {
          scope: $scope
      }).then(function(modal) 
      {
        $scope.open_order_details_model = modal;
      });

  $scope.open_detailed_design=function()
  { 
    $scope.order_details_total_at_model=0;
    angular.forEach($scope.selected_items, function(value, key)
    {
      $scope.order_details_total_at_model= $scope.order_details_total_at_model+value.product_details[0].quantity*value.product_details[0].unit.price;
    });
    $scope.open_order_details_model.show();
  }
  
 
  $scope.show_total=function(final_price)
  {
     
    $scope.total=0;
    angular.forEach($localStorage.selected_items, function(value, key)
    {
      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    });
  }
});



app.controller('recent_ordersCtrl', function(Services, $scope, $state, $localStorage, $ionicModal, $ionicHistory, UiServices){


    var req_data={
      user_id: '7'
    };
  
      
    

    UiServices.show_loader();
    Services.webServiceCallPost(req_data, 'get_orders').then(function(response)
    {
      if(response.data[1].response.status==1)
      {
        $scope.recent_orders_data=response.data[0].data;
        UiServices.hide_loader();
      }
    });

    $scope.get_order_details=function(order_id)
    {
      $state.go('app.view_order_details', {order_id: order_id});
    }
    $scope.open_verification_model=function(order_id)
    {
      $state.go('app.view_order_details', {order_id: order_id, order_verification: 1});      
    }
    $scope.go_back=function()
    {
        $ionicHistory.goBack();
    }

});



app.controller('view_order_detailsCtrl', function($scope, $stateParams, Services, $ionicHistory, UiServices) 
{

    $scope.test=[];   
    var sending_data={order_id: $stateParams.order_id};
    $scope.order_verification = $stateParams.order_verification;
     UiServices.show_loader();
     Services.webServiceCallPost(sending_data, 'get_order_details').then(function(response)
      {
          if(response.data[1].response.status==1)
          {
            $scope.order_details=response.data[0].data;
            UiServices.hide_loader();
          }
      });
     $scope.testimonial=function()
     {
      alert('shivam :'+JSON.stringify($scope.test));
     }
      $scope.go_back=function()
      {
        $ionicHistory.goBack();
      }
});
app.controller('loginCtrl', function($scope, $stateParams, Services, $ionicModal, $localStorage, $state)
{

  $scope.loginData = {};
  $scope.doLogin = function() 
  {

   Services.webServiceCallPost($scope.loginData, 'login').then(function(response)
    {
      if(response.data[1].response.status==1)
      { 

        $scope.loginData={};
        $localStorage.user_data = response.data[0].data.user_id;
        $scope.user_data = $localStorage.user_data;
        $state.go('app.dashboard'); 

      }
    });
  }

});