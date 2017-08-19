"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, Constant, UiServices, $http, Additional_services, $filter, $localStorage, $rootScope, $state, $cordovaDatePicker, $ionicHistory, $ionicPlatform, $ionicPopup) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $ionicPlatform.registerBackButtonAction(function (event) 
    {       
            if($state.current.name=='app.dashboard')
            {
              if($scope.raise_concern_model.isShown())
              {
                $scope.raise_concern_model.remove();
                event.preventDefault();
              }
              else
                {
                  ionic.Platform.exitApp();
                  event.preventDefault();
                }
            }
            else if($state.current.name=='login')
            {
            	 ionic.Platform.exitApp();
                  event.preventDefault();
            }
            else
            {
              $ionicHistory.goBack();
            }
    }, 200);  


 


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
        $scope.change_password_model.hide();
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
        UiServices.hide_loader();
        $scope.recent_orders_data=response.data[0].data;
        //by default shivam
        $scope.concern.selected_order_id=$scope.recent_orders_data[$scope.recent_orders_data.length-1].id;
        $scope.raise_concern_model.show();
      }
      else
      {
        UiServices.hide_loader();
        UiServices.alert_popup('<center>No orders Found for Concern</center>');
      }
    });
  }
  $scope.raise_my_concern_now=function()
  {
    $scope.concern.user_id=$scope.user_data.user_id;
    UiServices.show_loader();
    Services.webServiceCallPost($scope.concern, 'store_concern').then(function(response)
    {
      if(response.data[1].response.status==1)
      {
        UiServices.hide_loader();
        $ionicPopup.alert({
                template: '<center>Concern Registered successfully</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
			        $scope.raise_concern_model.hide();
                        
                });
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

  
  var sending_data={user_id: $scope.user_data.user_id};
  UiServices.show_loader();
  Services.webServiceCallPost(sending_data, 'get_pass_changed_status').then(function(response)
  {
 	$rootScope.is_pass_changed_status=response.data[0].data.is_pass_changed;
  	UiServices.hide_loader();
  });
});


//dashboard_controller




app.controller('dashboardCtrl', function($scope, Services, $timeout,  Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage, $state, $cordovaDatePicker, $q, $ionicPopup, $rootScope)  
{
	if($rootScope.is_pass_changed_status==0)
	{
		var confirmPopup = $ionicPopup.confirm({
        title: 'Change password',
        template: '<center>As you have come here first time so you can change your Password</center>',
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
              			$scope.change_password_open();
              	}

              });	
	}
	

              

  if($localStorage.selected_items==undefined)
  {
    $localStorage.selected_items=[];
  }

  $scope.selected_items = $localStorage.selected_items;
   
//check now
  /* var requesting_data=[];    
    angular.forEach($scope.selected_items, function(value, key)
    { 
      var d=
      {
        product_id: value.product_details[0].product_id
      };
      requesting_data.push(d);
    });
    UiServices.show_loader();
    Services.webServiceCallPost(requesting_data, 'get_local_data_back').then(function(response)
    { 
      angular.forEach(response.data[0].data, function(value, key){

        value.product_details[0].quantity=1;
        value.product_details[0].final_price=0;
        //shivam gupta


      });
      $scope.selected_items = response.data[0].data;
      UiServices.hide_loader();
      
      

    });*/
    




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


  $ionicModal.fromTemplateUrl('templates/shipping_addresses.html',
  {
    scope: $scope
  }).then(function(modal)
  {
    $scope.shipping_addresses_model=modal;
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
		$scope.modal.hide();
   }
   else
   {
   		$ionicPopup.alert({
                template: '<center>Already added in the card</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
   					$scope.modal.hide();
                        
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
    else
    {
        $scope.removeItem(index);
    }


  }
  $scope.aQuantity=function(index, quantity)
  {
    $localStorage.selected_items[index].product_details[0].quantity = quantity+1;
    $scope.show_total(index);
  }
  $scope.removeItem=function(index)
  { 


  	var confirmPopup = $ionicPopup.confirm(
    	{
                 title: 'Remove product',
                 template: '<center>Are you sure ?</center>',
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

                 	$localStorage.selected_items.splice(index, 1);
				    $scope.total=0;
				    angular.forEach($localStorage.selected_items, function(value, key)
				    {
				      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
				    });
                 } 
                 else 
                 {
                    console.log('else');
                 }
        });

    

  }
  $scope.open_date_picker=function(selecte_address_id)
  {
    alert('date');
     alert('selected_address_id :'+selected_address_id);
    $scope.shipping_addresses_model.hide();

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
        user_id: $scope.user_data.user_id,
        delivery_date: date,
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
                      var div='Your Order has been placed successfully';
                      UiServices.alert_popup(div);  
                    });  
                 } 
                 else 
                 {
                    console.log('else');
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

  $scope.open_shipping_address_page=function()
  {

    $scope.selected_address={};
    var temp_data=
    {
      user_id: $scope.user_data.user_id
    }

      UiServices.show_loader();
      Services.webServiceCallPost(temp_data, 'get_shipping_addresses').then(function(response)
      { 
        if(response.data[1].response.status===1)
        {
           UiServices.hide_loader();
           $scope.shipping_address_data=response.data[0].data;
           $scope.shipping_addresses_model.show();
        }
        else
        {
          UiServices.alert_popup('shipping address not available');
        }
      });
   }

      

});
app.controller('recent_ordersCtrl', function(Services, $scope, $state, $localStorage, $ionicModal, $ionicHistory, UiServices){
    var req_data={
      user_id: $scope.user_data.user_id
    };
    $scope.$on('$ionicView.enter',function()
    {
      UiServices.show_loader();
      Services.webServiceCallPost(req_data, 'get_orders').then(function(response)
      {
        if(response.data[1].response.status==1)
        {
          $scope.recent_orders_data=response.data[0].data;
          UiServices.hide_loader();
        }
        else
        {
          UiServices.hide_loader();
          UiServices.alert_popup('<center>No Recent Orders Found</center>');  
        }
      });



    });

    


    $scope.open_pdf=function(link)
    {
      window.open(link, '_system');

    }
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

    $scope.open_shipping_address_page=function()
   {
      $scope.selected_address={};
      var temp_data=
      {
        user_id: $scope.user_data.user_id
      }

      UiServices.show_loader();
      Services.webServiceCallPost(temp_data, 'get_shipping_addresses').then(function(response)
      { 
        if(response.data[1].response.status===1)
        {
           UiServices.hide_loader();
           $scope.shipping_address_data=response.data[0].data;
           $scope.shipping_addresses_model.show();
        }
        else
        {
          UiServices.alert_popup('shipping address not available');
        }
      });
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
            UiServices.hide_loader();
            $scope.order_details=response.data[0].data;
          }
          else if(response.data[1].response.status==0)
          {
            UiServices.hide_loader();
            UiServices.alert_popup('<center>Looks like Your Order is already Verified</center>');
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
       	    $ionicHistory.goBack();

          /*var disco=JSON.parse(req_data.order_details);
          for(var i=0; i<$scope.order_details.length; i++)
          {
            for(var j=0; j<disco.length; j++)
            {
              if($scope.order_details[i].product_id==disco[j])
              {
                $scope.order_details.splice(i, 1);
                alert('order_details :'+JSON.stringify($scope.order_details));
                $scope.checked_items=[];
                if($scope.order_details.length==0)
                {
                  alert('shivam length : 0');

                }
              }
            }
          }*/

      	});
      }
      


});
app.controller('loginCtrl', function($scope, $stateParams, Services, $ionicModal, $localStorage, $state, UiServices, $rootScope)
{

   
  $scope.$on('$ionicView.beforeEnter', function(e) 
  {
    $scope.loginData = {};
    if(($localStorage.user_data==undefined)|| (JSON.stringify($localStorage.user_data))==='{}')
     {
      $localStorage.user_data={};
     }
    else
    {
      $state.go('app.dashboard');
    }

  });

$scope.doLogin = function()
{	

	//$scope.loginData.player_id=$localStorage.player_id;
	$localStorage.player_id=null;
 	$scope.loginData.player_id = '123456';

   alert('$scope.loginData :'+JSON.stringify($scope.loginData));
	 UiServices.show_loader();
   Services.webServiceCallPost($scope.loginData, 'login').then(function(response)
   {
      if(response.data[1].response.status==1)
      { 	
          UiServices.hide_loader();
          $state.go('app.dashboard');
          $localStorage.user_data={};
          $localStorage.user_data = JSON.stringify(response.data[0].data);
          $scope.loginData={};     
      }
      else
      {
        UiServices.alert_popup('<center>It seems that you have entered wrong input</center>');     
        UiServices.hide_loader();
      }
    });
  }

});

app.controller('update_orderCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $ionicPopup){


	$scope.product_details=[];
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
            $scope.order_details = response.data[0].data;
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
      						quantity: value.quantity,
      						total_price: value.total_price,
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
      sending_data.user_id=$scope.user_data.user_id;
      sending_data.product_details=[];
     
      angular.forEach($scope.product_details, function(value, key)
      { 
        var my_extra_data=
        {
          quantity: value.data.product_details[0].quantity,
          product_id: value.data.product_details[0].product_id,
          unit_mapping_id: value.data.product_details[0].unit.unit_product_id,
          product_unit_mapping_id: value.data.product_details[0].unit.unit_product_mapping_id,
          total_price: value.data.product_details[0].quantity*value.data.product_details[0].unit.price,
          price: value.data.product_details[0].unit.price,
          name: value.data.product_details[0].product_name,
          size: value.data.product_details[0].unit.weight
        }
        sending_data.product_details.push(my_extra_data);
      });  
     

      var confirmPopup = $ionicPopup.confirm({
                 title: 'Order Update Confirmation',
                 template: '<center>Order updation changes depends on Terms and Condition Continue if agree</center>',
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
                    Services.webServiceCallPost(sending_data, 'update_order').then(function(response)
                    { 
                      if(response.data[1].response.status===1)
                      {
                       UiServices.hide_loader(); 
                       UiServices.alert_popup('<center>Request Submitted Successfully</center>');
                      }
                    });
                 } 
                 else 
                 {
                    //mat aa re
                 }
              });
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
	    $scope.product_details[index].data.product_details[0].quantity = parseInt(quantity)+1;
      	$scope.show_total(index);
      }
      $scope.dQuantity=function(index, quantity)
      {
      	if(quantity>1)
      	{
	      	$scope.product_details[index].data.product_details[0].quantity = parseInt(quantity)-1;
      		$scope.show_total();
      	}
      	else
      	{
	        $scope.removeItem(index);
      	}
      }

      $scope.removeItem=function(index)
      {
      		

    
      		var confirmPopup = $ionicPopup.confirm(
	    	{
	                 title: 'Remove product',
	                 template: '<center>Are you sure ?</center>',
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
	        			$scope.product_details.splice(index, 1);
			    	   	$scope.total=0;
			  		    angular.forEach($scope.product_details, function(value, key)
			  		    {
			  		      $scope.total=$scope.total+value.data.product_details[0].quantity*value.data.product_details[0].unit.price;
			  		    });
			          	if($scope.product_details.length==0)
			            UiServices.alert_popup('<center>No. of product must no be 0</center>');
	                 } 
	                 else 
	                 {
	                    console.log('else');
	                 }
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
        var extra_data={product_id: product_id};
        var index=-1;
        angular.forEach($scope.product_details, function(value, key)
        { 
           if(value.data.product_details[0].product_id==product_id)
           {
              index=key;
           }
        });

        if(index==-1)
        {

            UiServices.show_loader(); 
            Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
            {
                response.data[0].data.product_details[0].quantity=1;
                UiServices.hide_loader();
                  $scope.temp=[];
                  $scope.temp.push(response.data[0]);
                  angular.forEach($scope.product_details, function(value, key)
                  {
                    $scope.temp.push(value);
                  });
                  $scope.product_details=$scope.temp;
            });
        	$scope.modal.hide();

        }
        else
   		{
   		$ionicPopup.alert({
                template: '<center>Already added in the card</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
   					$scope.modal.hide();
                        
                });

   		}

      


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
  UiServices.alert_popup('<center>Express Shipping contains some extra charges</center>');
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
			$scope.modal.hide();
   }
   else
   {
   		$ionicPopup.alert({
                template: '<center>Already added in the card</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
   					$scope.modal.hide();
                        
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
      else
      {
        	$scope.removeItem(index);
      }
  }

  $scope.removeItem=function(index)
  { 

  	var confirmPopup = $ionicPopup.confirm(
    	{
                 title: 'Remove product',
                 template: '<center>Are you sure ?</center>',
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
        			$scope.selected_items.splice(index, 1);
    				$scope.total=0;
				    angular.forEach($scope.selected_items, function(value, key)
				    {
				      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
				    });
                 } 
                 else 
                 {
                    console.log('else');
                 }
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
                      var div='Your Order has been Created successfully';
                      UiServices.alert_popup(div); 
                       $state.go('app.dashboard');  
                    });  
                 } 
                 
              });
  }
});
app.controller('no_network_ConnectionCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup){


	$scope.$on('$ionicView.enter', function(e) 
	{
		UiServices.hide_loader();
  	});

    $scope.retry=function()
    {

      var networkState = navigator.connection.type;;
      var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
   		
    if(states[networkState]!="none")
    {
            $state.go('app.dashboard');
    }


  }

});