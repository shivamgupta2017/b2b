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

   $ionicModal.fromTemplateUrl('templates/add_new_address.html', 
   {
    scope: $scope
   }).then(function(modal) 
   {
    $scope.add_new_address = modal;
   });

   $scope.change_password_open=function()
   {
      $scope.change_password_model.show();
      document.getElementById("confirm_pass").style.borderColor='none';
   }
   $scope.submit_new_password=function()
   {
    if($scope.new_password.pass1==$scope.new_password.pass2)
    {
        var regex_pattern='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
        var patt=new RegExp(regex_pattern);
        var res=patt.test($scope.new_password.pass1);
        if(res)
        {
          $scope.new_password.user_id=$scope.user_data.user_id;
          UiServices.show_loader();
          Services.webServiceCallPost($scope.new_password, 'change_user_password').then(function(response)
          {
            if(response.data[1].response.status==1)
            {
              $scope.new_password={};
              UiServices.hide_loader();
              $ionicPopup.alert({
                  template: '<center>Password has been updated successfully</center>',
                  buttons:[{
                      text:'ok', type: 'button-assertive'
                  }]
                  }).then(function(res)
                  { 
                      $scope.new_password={};  
                     $scope.change_password_model.hide();
                  });
            }
            else
            {
              UiServices.hide_loader();
              $scope.new_password={};  
              UiServices.alert_popup('<center>Current password does not match</center>');

            }
          });
        }
        else
        {

         UiServices.alert_popup('<center>New password must contain character, special symbol and digit</center>');
        }

    }
    else
    {     
      $scope.new_password={};
         UiServices.alert_popup('<center>password does not match</center>');
    }
   }
   $scope.focus_kiya=function()
   {
          if($scope.new_password.pass1!=undefined && $scope.new_password.pass2!=undefined)
          {
            if($scope.new_password.pass1.length>0 && $scope.new_password.pass2.length>0)
            {
              if($scope.new_password.pass1!=$scope.new_password.pass2)
              {
                 document.getElementById("confirm_pass").style.borderBottom='thick solid #f44242';
              }
              else
              { 
                 document.getElementById("confirm_pass").style.borderBottom='thick solid #00e600';
                 
              }
            }
            else
            {
                 document.getElementById("confirm_pass").style.borderBottom='';
            }
          }
   }

   $scope.logout=function()
   {    
    $ionicHistory.clearCache().then(function()
    {
        $localStorage.user_data={};
        $state.go('login');

    });
   }
  $scope.open_address_model=function()
   {
      $scope.new_address_data={};
      $scope.add_new_address.show();
   }
   $scope.close_address_model=function()
   {
      $scope.add_new_address.hide();
   }
   $scope.submit_new_address=function()
   {
    $scope.new_address_data.user_id=$scope.user_data.user_id;



    UiServices.show_loader();
    Services.webServiceCallPost($scope.new_address_data, 'store_shipping_address').then(function(response)
    {
      UiServices.hide_loader();
      if(response.data[1].response.status==1)
      {
            
            $ionicPopup.alert(
            {
                      template: '<center>Address Saved successfully</center>',
                      buttons:[{
                          text:'ok', type: 'button-assertive'
                      }]
            }).then(function(res)
            {   
               $scope.add_new_address.hide();
            });
      }
      else
      {
        UiServices.alert_popup('<center>Our Service is Not available at this location</center>');
      }
    });



    $scope.new_address_data={};
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
        $scope.concern.selected_order_id=$scope.recent_orders_data[0].id;
        $scope.raise_concern_model.show();
      }
      else
      {
        UiServices.hide_loader();
        UiServices.alert_popup('<center>No Orders Found for Concern</center>');
      }
    });
  }
  $scope.open_gallery=function()
  {
  	navigator.camera.getPicture(onSuccess, onFail, 
    { 
          quality: 50, 
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          targetWidth: 512,
          targetHeight: 512,
          correctOrientation: true,
          
    }); 
      
      function onSuccess(imageURI) 
      {		
      	$scope.imageURI=imageURI;

      }
      function onFail(message) 
      {
          alert('Failed because: ' + message);
    }
  }
  $scope.raise_my_concern_now=function()
  {
    $scope.concern.user_id=$scope.user_data.user_id;
	
	if($scope.imageURI==undefined)
	{

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
	else
	{
		var win = function (r) 
    	{
		    if(r.responseCode==200)
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
		}
		var fail = function (error) 
		{

		    UiServices.hide_loader();
		    $ionicPopup.alert({
        		template: '<center>error</center>',
        		buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
			        $scope.raise_concern_model.hide();
                });
		}
  		var options = new FileUploadOptions();
        options.fileKey = 'file';
        options.fileName = $scope.imageURI.substr($scope.imageURI.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
        options.params = $scope.concern;
    	options.chunkedMode = false;
    	var ft = new FileTransfer();
        UiServices.show_loader();
 		ft.upload($scope.imageURI, encodeURI("http://192.168.1.138/admin/service/store_concern"), win, fail, options);

	}    

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
app.controller('dashboardCtrl', function($scope, Services, $timeout,  Constant, UiServices, Additional_services, $filter, $ionicModal, $localStorage, $state, $cordovaDatePicker, $q, $ionicPopup, $rootScope, $ionicHistory)  
{
	if($rootScope.is_pass_changed_status==0)
	{
		var confirmPopup = $ionicPopup.confirm({
        title: 'Change password',
        template: '<center>Change Your password Now</center>',
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

  $scope.$on('$ionicView.enter', function(event)
  {
    UiServices.show_loader(); 
    Services.webServiceCallPost('', 'get_products').then(function(response)
    {
      $rootScope.data = response.data[0].data;
      UiServices.hide_loader();
    });

    if($localStorage.selected_items.length>0)
    {
        var requesting_data=[];    
        angular.forEach($scope.selected_items, function(value, key)
        { 
          var d=
          {
            product_id: value.product_details[0].product_id
          };
          requesting_data.push(d);
        });
        if(requesting_data.length>0)
        {
          UiServices.show_loader();
          Services.webServiceCallPost(requesting_data, 'get_local_data_back').then(function(response)
          { 
            UiServices.hide_loader();
            angular.forEach(response.data[0].data, function(value, key)
            {
               value.product_details[0].quantity = $localStorage.selected_items[key].product_details[0].quantity;
               value.product_details[0].final_price = $localStorage.selected_items[key].product_details[0].final_price;
            });
            $localStorage.selected_items = response.data[0].data;
            $scope.selected_items=$localStorage.selected_items;

          });
        }
    }
  });
  if($localStorage.selected_items==undefined)
  {
    $localStorage.selected_items=[];
  }
  $scope.selected_items = $localStorage.selected_items;
  //alert('$localStorage.selected_items after :'+JSON.stringify($localStorage.selected_items));    
   //doing for price updation    

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

  $ionicModal.fromTemplateUrl('templates/detailed_product_selection.html',
  {
    scope: $scope
  }).then(function(modal)
  {
    $scope.detailed_product_desc=modal;
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
  $scope.close_shipping_address_model=function()
  {
    $scope.shipping_addresses_model.hide();
  }


//shivam gupta

  $scope.product_name_clicked=function(product_id)
  { 
    	var extra_data=
      {
    	      product_id: product_id
    	}

      UiServices.show_loader(); 
      Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
      {
          UiServices.hide_loader(); 
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
            $scope.modal.hide();
            $scope.detailed_product_desc.show();
          }
      });
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
  $scope.open_date_picker=function(add_id)
  {
      $scope.shipping_addresses_model.hide();
      
	    var date = new Date();
		date.setDate(date.getDate() + 1);
      	
      var options = 
      {
        date: date,
        mode: 'date', // or 'time'
        minDate: date - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
      };

    $cordovaDatePicker.show(options).then(function(date)
    { 
        $scope.save_order(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate(), add_id);         
    });
  }
  $scope.save_order=function(date, selected_address_id)
  {
      var req_obj=
      {
        user_id: $scope.user_data.user_id,
        delivery_date: date,
        is_express: 0,
        selected_address_id: selected_address_id        
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
                 title: 'You Are placing Order',
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
                      var div='<center>Your Order has been placed successfully</center>';
                      UiServices.alert_popup(div);
                      if($scope.open_order_details_model.isShown())
                          $scope.open_order_details_model.hide();
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
           $scope.selected_address.id=$scope.shipping_address_data[0].shipping_add_id;
           $scope.shipping_addresses_model.show();
        }
        else
        {
          UiServices.alert_popup('shipping address not available');
        }
      });
   }
   $scope.add_product_to_cart_list=function()
   {    
          $scope.detailed_product_desc.hide();
          angular.forEach($localStorage.selected_items, function(value, key) 
          {
            $scope.temp.push(value);
          });
          $localStorage.selected_items=$scope.temp;
          $scope.selected_items = $localStorage.selected_items;
          $scope.temp=[];
          console.log('localStorage.selected_items :'+JSON.stringify($scope.selected_items));
   }


});
app.controller('recent_ordersCtrl', function(Services, $scope, $state, $localStorage, $ionicModal, $ionicHistory, UiServices, $ionicPopup){
    var req_data=
    {
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
          $ionicPopup.alert({
                template: '<center>No Recent Order Found</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                   $ionicHistory.goBack();     
                });          

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
   $scope.get_order_history=function(order_id)
   {
       $state.go('app.view_order_details', {order_id: order_id, order_verification: 2});
   }


});

app.controller('view_order_detailsCtrl', function($scope, $stateParams, Services, $ionicHistory, UiServices) 
{

    $scope.checked_items=[];   
    var sending_data={order_id: $stateParams.order_id};
    $scope.order_verification = $stateParams.order_verification;
    if($scope.order_verification==2)
    {
        UiServices.show_loader();
        Services.webServiceCallPost(sending_data, 'get_updated_orders').then(function(response)
        {
          if(response.data[1].response.status==1)
          {
              UiServices.hide_loader();
              $scope.order_history_data=response.data[0].data;
          }
        });
    }
    else
    {
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


    } 



     
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



  $scope.kyc_request={};


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
	// $localStorage.player_id=null;
    $scope.loginData.player_id = '123456';
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

  $ionicModal.fromTemplateUrl('templates/kyc.html', 
  {
    scope: $scope
  }).then(function(modal) 
  {
    $scope.kyc = modal;
  });

  $scope.open_kyc_form=function()
  {
    $scope.kyc.show();

  }
  $scope.close_syc_model=function()
  {
    $scope.kyc.hide();
  }
  $scope.submit_request_for_kyc=function()
  {
    UiServices.show_loader();
    Services.webServiceCallPost($scope.kyc_request, 'kyc_request').then(function(response)
    {
      UiServices.show_loader();


      $scope.kyc.hide();

    })    





  }
  $scope.close_kyc_request=function()
  {
    $scope.kyc.hide();
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
     Services.webServiceCallPost(sending_data, 'get_order_whole_details').then(function(response)
     {  
        if(response.data[1].response.status==1)
        {
          UiServices.hide_loader();
          $scope.product_details=response.data[0].data;
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
          quantity: value.product_details[0].quantity,
          product_id: value.product_details[0].product_id,
          unit_mapping_id: value.product_details[0].unit.unit_product_id,
          product_unit_mapping_id: value.product_details[0].unit.unit_product_mapping_id,
          total_price: value.product_details[0].quantity*value.product_details[0].unit.price,
          price: value.product_details[0].unit.price,
          name: value.product_details[0].product_name,
          size: value.product_details[0].unit.weight
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
                       $scope.order_details={};
                       $ionicPopup.alert({
                       template: '<center>Request Submitted Successfully</center>',
                       buttons:[{
                          text:'ok', type: 'button-assertive'
                      }]
                      }).then(function(res)
                      {   
                          $ionicHistory.goBack();                       
                      });
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
      		$scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    	});
     }

     $scope.go_back=function()
      {
        $ionicHistory.goBack();
      }
      $scope.aQuantity=function(index, quantity)
      {	
	      $scope.product_details[index].product_details[0].quantity = parseInt(quantity)+1;
      	$scope.show_total(index);
      }
      $scope.dQuantity=function(index, quantity)
      {
      	if(quantity>1)
      	{
	      	$scope.product_details[index].product_details[0].quantity = parseInt(quantity)-1;
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
    			  		      $scope.total=$scope.total+value.product_details[0].quantity*value.product_details[0].unit.price;
    			  		    });
                    
    			          	if($scope.product_details.length==0)
    			            {
                        $ionicPopup.alert({
                        template: '<center>cart can\'t be of empty</center>',
                        buttons:[{
                            text:'ok', type: 'button-assertive'
                        }]
                        }).then(function(res)
                        {   
                            $ionicHistory.goBack(-1);
                        });
                      }
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
           if(value.product_details[0].product_id==product_id)
           {
              index=key;
           }

        });
        if(index==-1)
        {
            UiServices.show_loader(); 
            Services.webServiceCallPost(extra_data, 'get_product_details').then(function(response)
            {
                  UiServices.hide_loader();
                  response.data[0].data.product_details[0].quantity=1;
                  $scope.temp=[];
                  $scope.temp.push(response.data[0].data);
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

app.controller('express_shippingCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup, $cordovaDatePicker){

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
  UiServices.alert_popup('<center>Express Shipping may contain extra charges</center>');
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
  $scope.close_shipping_address_model=function()
  {

        $scope.shipping_addresses_model.hide(); 


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
  $scope.order_now_emergency_products=function(emergency_shipping_date ,shipping_address_id)
  {

      var req_obj=
      {
      
        user_id: JSON.parse($localStorage.user_data).user_id,
        is_express: 1,
        delivery_date : emergency_shipping_date,
        selected_address_id: shipping_address_id,
      
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
                    $scope.shipping_addresses_model.hide(); 
                    UiServices.show_loader();
                    Services.webServiceCallPost(req_obj, 'create_order').then(function(response)
                    {
                      UiServices.hide_loader();
                     
                      $localStorage.selected_items=[];
                      $scope.selected_items=[];
                      var div='<center>Your Order has been placed Successfully</center>';
                      $ionicPopup.alert({
                      template: div,
                      buttons:[{
                          text:'ok', type: 'button-assertive'
                      }]
                      }).then(function(res)
                      {   
                         $ionicHistory.goBack();        
                      });
                    });  
                 } 
              });
  }
  $ionicModal.fromTemplateUrl('templates/shipping_address_for_express.html',
  {
    scope: $scope
  }).then(function(modal)
  {
    $scope.shipping_addresses_model=modal;
  });
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
           $scope.selected_address.id=$scope.shipping_address_data[0].shipping_add_id;
           $scope.shipping_addresses_model.show();
        }
        else
        {
          UiServices.alert_popup('shipping address not available');
        }
      });
   }

   $scope.open_date_picker=function(add_id)
  	{
      $scope.shipping_addresses_model.hide();
      var options = 
      {
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
    	//emergency shipping
        $scope.order_now_emergency_products(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate(), add_id);         
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
      
      if(states[networkState]!=states[Connection.NONE])
      {   
          $state.go('app.dashboard');
      }
    }

});