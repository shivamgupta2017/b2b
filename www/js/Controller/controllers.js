"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage, $rootScope, $state, $cordovaDatePicker, $ionicHistory) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});





  $ionicModal.fromTemplateUrl('templates/raise_my_concern.html', 
  {
          scope: $scope
  }).then(function(modal) 
  {
    $scope.raise_concern_model = modal;
  });

  $scope.user_data=JSON.parse($localStorage.user_data);
  $rootScope.constant_image_url=Constant.base_url.image_url;



  $ionicModal.fromTemplateUrl('templates/change_user_password.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.change_password_model = modal; 
   });

   $scope.new_password={};

  $scope.login = function() 
  {
      $state.go('login');
  }
   $scope.change_password_open=function()
   {
    $scope.change_password_model.show();
   }
   $scope.submit_new_password=function()
   {
    $scope.new_password.user_id=$scope.user_data.user_id;
    UiServices.show_loader();
    Services.webServiceCallPost($scope.new_password, 'change_user_password').then(function(response)
    {
      if(response.data[1].response.status==1)
      {

        $scope.new_password={};
        UiServices.hide_loader();
        UiServices.alert_popup('<center>Password has been updated successfully</center>');  
      }

    });


   }
   $scope.logout=function()
   {    
    $ionicHistory.clearCache().then(function()
    {
        $localStorage.user_data={};
        $state.go('login');
    });
   }
  
  $scope.raise_my_concern=function()
  {

    $scope.concern={};
    var user_data=JSON.parse($localStorage.user_data);
    var req_data=
    {
      user_id: user_data.user_id
    };

    UiServices.show_loader();
    Services.webServiceCallPost(req_data, 'get_orders').then(function(response)
    {
      if(response.data[1].response.status==1)
      {
        $scope.recent_orders_data=response.data[0].data;
        UiServices.hide_loader();
        $scope.raise_concern_model.show();
      }
    });

    

  }

    
  $scope.raise_my_concern_now=function()
  {

    var user_data=JSON.parse($localStorage.user_data);
    $scope.concern.user_id=user_data.user_id;
    UiServices.show_loader();
    Services.webServiceCallPost($scope.concern, 'store_concern').then(function(response)
    {
 
      if(response.data[1].response.status==1)
      {
        UiServices.hide_loader();
        $scope.raise_concern_model.hide();
        
      }
      
    });




  }
  $scope.close_change_user_password=function()
  {
    $scope.change_password_model.hide();
  }
  $scope.close_raise_concern_model = function() 
  {
    $scope.raise_concern_model.hide();
  };
  $scope.recent_orders=function()
  {
    $state.go('app.recent_orders');
  };   
  $scope.open_express_shipping=function()
  {
      $state.go('app.express_shipping');
  };
});


//dashboard_controller

app.controller('dashboardCtrl', function($scope, Services, $timeout,  Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage, $state, $cordovaDatePicker, $q, $ionicPopup, $rootScope)  
{
  if($localStorage.selected_items==undefined)
  {
    $localStorage.selected_items=[];
  }

  $scope.selected_items = $localStorage.selected_items;
    UiServices.show_loader(); 
    Services.webServiceCallPost('', 'get_products').then(function(response)
    {
      $rootScope.data = response.data[0].data;
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
        angular.forEach($localStorage.selected_items, function(value, key)
        {
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
    
  
      var req_obj=
      {
        user_id: $localStorage.user_data,
        delivery_date: '2017-7-25',
        is_express: 0        
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
                 template: '<center>Are you sure?</center>',
                 buttons :[
                 {
                  text: 'cancel'
                 },
                 {
                  text: 'Confirm', type: 'button-assertive',
                  onTap: function(e) {
                    return 1;
                  }
                 }]
              }).then(function(res) 
              

              {
                
                 if(res) 
                 {
                    UiServices.show_loader();
                    Services.webServiceCallPost(req_obj, 'create_order').then(function(response)
                    {
                      UiServices.hide_loader();
                      $localStorage.selected_items=[];
                      $scope.selected_items=[];
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
      $ionicModal.fromTemplateUrl('templates/order_details.html', 
      {
          scope: $scope
      }).then(function(modal) 
      {
        $scope.open_order_details_model = modal;
      });

  $scope.open_detailed_design=function()
  { 
    $scope.open_order_details_model.show();
  }
  
 $scope.close_detailed_design=function()
 {
    $scope.open_order_details_model.hide();

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
      $state.go('app.view_order_details', {order_id: order_id, order_verification: 0});
    }
    $scope.open_verification_model=function(order_id)
    {
      $state.go('app.view_order_details', {order_id: order_id, order_verification: 1});      
    }
    $scope.go_back=function()
    {
        $ionicHistory.goBack();
    }
    $scope.update_order=function(order_id)
    {
	   	$state.go('app.update_order_details', {order_id: order_id});
    }


});



app.controller('view_order_detailsCtrl', function($scope, $stateParams, Services, $ionicHistory, UiServices) 
{

    $scope.checked_items=[];   
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
          else if(response.data[1].response.status==0)
          {
            alert('failed');
            UiServices.hide_loader();
          }
      });
      $scope.go_back=function()
      {

        $ionicHistory.goBack();
      }
      $scope.accept_order=function()
      {

      	var req_data={};
      	req_data.order_id= $scope.order_details[0].order_id; 
      	 req_data.order_details= [];
      
      	
 		
      	angular.forEach($scope.checked_items, function(value, key)
      	{
      		if(value)
      		{	
      			req_data.order_details.push($scope.order_details[key].product_id);	  		
      		}
      	});
      	req_data.order_details=JSON.stringify(req_data.order_details);
        UiServices.show_loader();
      	Services.webServiceCallPost(req_data, 'verify_order').then(function(response)
      	{
      		UiServices.hide_loader();
          var disco=JSON.parse(req_data.order_details);
          for(var i=0; i<$scope.order_details.length; i++)
          {
            for(var j=0; j<disco.length; j++)
            {
              if($scope.order_details[i].product_id==disco[j])
              {
                $scope.order_details.splice(i, 1);
                $scope.checked_items=[];
              }
            }
          }
      	});
      }
      


});
app.controller('loginCtrl', function($scope, $stateParams, Services, $ionicModal, $localStorage, $state, UiServices)
{
 
   var x=document.getElementById('hide_me');
   $scope.loginData = {};
    
   if($localStorage.user_data==undefined)
   {
      $localStorage.user_data={};    
   }


   if(JSON.stringify($localStorage.user_data)=='{}')
    {
        x.style.visibility='initial';       
        /* window.plugins.OneSignal.getIds(function(ids) 
       {
          $scope.loginData.player_id=ids.userId;
       });*/
    
   }
  else
  {

    x.style.visibility='hidden';
    $state.go('app.dashboard');

  }


  
  
  $scope.doLogin = function() 
  {
    

   $scope.loginData.player_id='123456789';
   UiServices.show_loader();
   Services.webServiceCallPost($scope.loginData, 'login').then(function(response)
   {
      if(response.data[1].response.status==1)
      { 
          $localStorage.user_data={};
          $localStorage.user_data = JSON.stringify(response.data[0].data);
          $scope.loginData={};          
          $state.go('app.dashboard'); 
          UiServices.hide_loader();
      
      }
      else
      {

        UiServices.alert_popup('<center>Invalid Credential</center>');     
        UiServices.hide_loader();
      }
    });
  }


});

app.controller('update_orderCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope){

	$ionicModal.fromTemplateUrl('templates/search.html', 
  	{
    	scope: $scope,
    	animaiton: 'slide-in-up'
  	}).then(function(modal) 
  	{
   	 $scope.modal = modal;
  	});

		
	var sending_data=
	{
		order_id: $stateParams.order_id
	};
	

	$scope.product_details=[];
	UiServices.show_loader();
     Services.webServiceCallPost(sending_data, 'get_order_details').then(function(response)
     {
          if(response.data[1].response.status==1)
          {
            $scope.order_details=response.data[0].data;
            UiServices.hide_loader();
            angular.forEach($scope.order_details, function(value, key)
            {
            	var extra_data=
            	{
            		product_id: value.product_id
            	};
            	UiServices.show_loader();
          		Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
 	   			{	
					var temp =
					{
						quantity: 1
					};
					angular.extend(response.data[0].data.product_details[0], temp);
  	   				$scope.product_details.push(response.data[0]);
 	   				UiServices.hide_loader();
    			});
          		
            });
            
          }

      });


     $scope.update_now=function()
     {
     	alert('check :'+JSON.stringify($scope.product_details[0]));

     }
     $scope.show_total=function(index)
     {
     	$scope.total=0;
   		angular.forEach($scope.product_details, function(value, key)
    	{
      		$scope.total=$scope.total+value.data.product_details[0].quantity*value.data.product_details[0].unit.price;
    	});

     }

     $scope.go_back=function()
      {

        $ionicHistory.goBack();
      }
      $scope.aQuantity=function(index, quantity)
      {
      	$scope.product_details[index].data.product_details[0].quantity = quantity+1;
      	$scope.show_total(index);
      }
      $scope.dQuantity=function(index, quantity)
      {
      	if(quantity>1)
      	{
	      	$scope.product_details[index].data.product_details[0].quantity = quantity-1;
      		$scope.show_total();
      	}
      }

      $scope.removeItem=function(index)
      {
      		$scope.product_details.splice(index, 1);
    		$scope.total=0;
		    angular.forEach($scope.product_details, function(value, key)
		    {

		      $scope.total=$scope.total+value.data.product_details[0].quantity*value.data.product_details[0].unit.price;
		     
		    });
      }

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
	 	alert('shivam '+product_id);
	 }
});

app.controller('express_shippingCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup){

  $scope.selected_items=[];
  $ionicModal.fromTemplateUrl('templates/search.html', 
  {
    scope: $scope,
    animaiton: 'slide-in-up'
  }).then(function(modal) 
  {
    $scope.modal = modal;
  });

  var res=JSON.parse($localStorage.user_data);
  var user_details={user_id: res.user_id};
  UiServices.alert_popup('<center>Express shipping may contain some extra shipping charges continue if agree</center>');
  UiServices.show_loader();
  
  Services.webServiceCallPost(user_details, 'express_shipping_charges').then(function(res)
  {
    $scope.extra_charges=res.data[0].data.express_shipping_charges;
    UiServices.hide_loader();
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
       angular.forEach($scope.selected_items, function(value, key)
       {
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

          UiServices.hide_loader();
          angular.extend(response.data[0].data.product_details[0], extra_data);
          $scope.temp=[];
          $scope.temp.push(response.data[0].data);
          angular.forEach($scope.selected_items, function(value, key) 
          {
            $scope.temp.push(value);
          });
          
          $scope.selected_items=$scope.temp;
          //$scope.selected_items = $localStorage.selected_items;
           
        }
    });

   }
  }

  $scope.aQuantity=function(index, quantity)
  {   
      $scope.selected_items[index].product_details[0].quantity = quantity+1;    
      $scope.show_total(index);
  }
  $scope.dQuantity=function(index, quantity)
  {
      if(quantity>1)
      {
          $scope.selected_items[index].product_details[0].quantity = quantity-1;
          $scope.show_total(index);
      }
  }

  $scope.removeItem=function(index)
  { 
    $scope.selected_items.splice(index, 1);
    $scope.total=0;
    angular.forEach($scope.selected_items, function(value, key)
    {
      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    });
  }


  $scope.show_total=function(final_price)
  {
     
    $scope.total=0;
    angular.forEach($scope.selected_items, function(value, key)
    {
      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    });
  }

  $scope.go_back=function()
  {
    $ionicHistory.goBack();
  }
  $scope.order_now_emergency_products=function()
  {
      
      var user_id = JSON.parse($localStorage.user_data);
      var req_obj=
      {
        user_id: user_id.user_id,
        is_express: 1,
        delivery_date : ''
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
      var confirmPopup = $ionicPopup.confirm(
              {
                 title: 'Create Order Confirmation',
                 template: '<center>Are you sure?</center>',
                 buttons :[
                 {
                  text: 'cancel'
                 },
                 {
                  text: 'Confirm', type: 'button-assertive',
                  onTap: function(e) {
                    return 1;
                  }
                 }]
              }).then(function(res) 
              {
                
                 if(res) 
                 {  
                    UiServices.show_loader();
                    Services.webServiceCallPost(req_obj, 'create_order').then(function(response)
                    {
                      UiServices.hide_loader();
                      $localStorage.selected_items=[];
                      $scope.selected_items=[];
                      var div='Your Order has been placed successfully, will place your order by your order date, we hope to have you again';
                      UiServices.alert_popup(div); 
                       $state.go('app.dashboard');  
                    });  
                 } 
                 
              });






  }


});

