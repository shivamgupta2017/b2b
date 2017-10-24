"use strict";
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, Services, UiServices, $http, Additional_services, $localStorage, $rootScope, $state, $ionicHistory, $ionicPlatform, $ionicPopup) {

  //$ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	
	


    $rootScope.usrname=$localStorage.user_data.name;
    $rootScope.mobile=$localStorage.user_data.mobile;	
    $ionicPlatform.registerBackButtonAction(function (event) 
    {       
            if($state.current.name=='app.dashboard')
            {
              if($scope.change_password_model.isShown())
              {
                $scope.change_password_model.remove();
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


  $scope.openSomething=function(state,item)
  {
	  $state.go(state, {item: (item)});      

//  $scope.select_service_provider.show();
  }


  $ionicModal.fromTemplateUrl('templates/change_user_password.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.change_password_model = modal; 
   });
   $scope.new_password={};

   

   $scope.change_password_open=function()
   {
      $scope.change_password_model.show();
      document.getElementById("confirm_pass").style.borderColor='none';
   }
   $scope.add_wallet_balance_now=function()
  {
    //alert(JSON.stringify($localStorage.user_data));
    window.open('http://vedpay.com/api/AddWallet.aspx?UserId='+$localStorage.user_data.mobile+'&Password='+$localStorage.user_data.password);
    //$state.go('app.add_wallet_balance_now');
  }

   $scope.submit_new_password=function()
   {


    //hardcoded

    if($scope.new_password.pass1==$scope.new_password.pass2)
    {
        /*var regex_pattern='^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
        var patt=new RegExp(regex_pattern);
        var res=patt.test($scope.new_password.pass1);*/

        console.log(JSON.stringify($localStorage.user_data));
        var res=true;
        if(res)
        {
          UiServices.show_loader();
          $http(
          {
            method: 'GET',
            url: 'http://vedpay.com/api/Android.aspx?from=Customer&message=6%20CPASS%20'+$localStorage.user_data.mobile+'%20'+$scope.new_password.pass1+'%20'+$scope.new_password.current,
            data:''
          }).then(function successCallback(response) 
          {

            console.log(JSON.stringify(response));
            var r_data=response.data.substring(0, response.data.indexOf('\r')).split(',');
            if(r_data[0]==1)
            {
              UiServices.hide_loader();
              $scope.new_password={};
              $ionicPopup.alert({
                  template: '<center>Password has been updated successfully</center>',
                  buttons:[{
                      text:'ok', type: 'button-assertive'
                  }]
                  }).then(function(res)
                  { 
                      $scope.new_password={};  
                     $scope.change_password_model.hide();

                     $ionicHistory.clearCache().then(function()
                    {
                        $localStorage.user_data={};
                        $state.go('login');

                    });
                  });
            } 
            else
            {
              UiServices.hide_loader();
              $scope.new_password={};  
              UiServices.alert_popup('<center>Invalid Input</center>');
              //error problem
            }


          }, function errorCallback(response) {
            UiServices.hide_loader();
            //alert('err'+response);
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
   

   $scope.logout=function()
   {    
    $ionicHistory.clearCache().then(function()
    {
        $localStorage.user_data={};
        $state.go('login');

    });
   }

   $scope.get_last_recharges=function()
    {
      $state.go('app.last_recharge');
    }
  $scope.close_change_user_password=function()
  {
    
    $scope.change_password_model.hide();
    $scope.new_password={}; 
  }
  $scope.open_ewallet_transactions=function()
  {
    $state.go('app.ewallet_transaction_history');
  }

  
});

//dashboard_controller
app.controller('dashboardCtrl', function($scope, Services, $timeout, UiServices, Additional_services, $ionicModal, $localStorage, $state, $q, $ionicPopup, $rootScope, $ionicHistory, $http)  
{

UiServices.show_loader();
    $http(
    {
      method: 'GET',
      url:'http://vedpay.com/api/android.aspx?from=Customer&message=6%20BAL%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password,
      data:''
    }).then(function successCallback(response) 
    {
      UiServices.hide_loader();
      var result=response.data.substring(0, response.data.indexOf('\r')).split(',');
      if(result[0]==1)
      {
        $rootScope.balance=result[2];
      }
      else
      {
        UiServices.hide_loader();
      }
    }, function errorCallback(response) {
      UiServices.hide_loader();
    });


	
  $scope.data={};
  
//			  1			2		3		5	6	7	   8       9
  $scope.recharge_type=[{
			   id:1,
			   name:'Mobile Recharge'
			}, 
			{
			   id:3,
			   name:'Datacard'
			},
			{
			   id:5,
			   name: 'DTH'
			},
			{   
			   id:6,
			   name:'Landline'},
			{
			   id:7,
			   name:'Electricity'
			},
			{
			   id:8,
			   name:'Gas'
			},
			{
			   id:9,
			   name:'Insurance'
			}
		     ];
  



  


  $scope.serverSideChange=function(item)
  {

  	if(item==1)
   	{
		$state.go('app.recharge', {item: (item)});      
   		//recharge
   	} 
   	else if(item==3)
   	{
   		$state.go('app.datacard', {item: (item)});
   	}
   	else if(item==5)
   	{
   		$state.go('app.dth', {item: (item)});
   	}
   	else if(item==6)
   	{

   		$state.go('app.landline', {item: (item)});
   	}
   	else if(item==7)
   	{
   		$state.go('app.electricity', {item: (item)});
   	}
   	else if(item==8)
   	{
   		$state.go('app.gas', {item: item});

   	}
   	else if(item==9)
   	{
   		$state.go('app.insurance', {item :item});
   	}

   	
   	 

  }
  


  $scope.wallet_transfer={};
  $ionicModal.fromTemplateUrl('templates/wallet_transfer.html', 
  {
    scope: $scope
  }).then(function(modal) 
  {
    $scope.wallet_transfer_modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/customer_wallet_registrations.html', 
  {
    scope: $scope
  }).then(function(modal) 
  {
 
    $scope.customer_wallet_regitstration_for_to_bank = modal;
 
  });

  $scope.a = {};
  $scope.a.airplaneMode = false;



$scope.change = function()
{
  //shivam
  
  if($scope.a.airplaneMode && $scope.register_now)
  {
    //if changes to on that measn  goes to on sand if it is on to check whether customer is registered or not
    $scope.user_data={
      mobile_no: $localStorage.user_data.mobile,
      password: $localStorage.user_data.password,
      otp_sent: false
    }
    $scope.customer_wallet_regitstration_for_to_bank.show();
  }
  console.log($scope.a.airplaneMode);
}

  //check member



  $ionicModal.fromTemplateUrl('templates/add_new_beneficiary_form.html', 
  {
    scope: $scope
  }).then(function(modal) 
  {
    $scope.new_beneficiary_modal = modal;
  });


  $scope.add_new_beneficiary=function()
  {
    $scope.add_beneficiary={};
    $scope.add_beneficiary={
      show_otp_input: false
    };
    $scope.new_beneficiary_modal.show();
  }
  $scope.press_button_add_new_beneficiary=function()
  {

    if(!($scope.add_beneficiary.show_otp_input))
    {
      UiServices.show_loader();
      $http(
      {
        method: 'GET',
        url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20ADDBENEFICIARY%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.add_beneficiary.bname+'%20'+$scope.add_beneficiary.mobile+'%20'+$scope.add_beneficiary.acc_no+'%20'+$scope.add_beneficiary.ifsc,
        data:''
      }).then(function successCallback(response) 
      {
        UiServices.hide_loader();

        if(response.data[0].error_code==200)
        {

          $scope.add_beneficiary.beneficiary_id=response.data[0].beneficiaryId;
          $scope.add_beneficiary.show_otp_input=true;
          UiServices.alert_popup('<center>Otp Sent Successfully</center>');

        }
        else
        {
          //response.data[0].resText;
          UiServices.alert_popup('<center>'+response.data[0].resText+'</center>');

        }
      }, function errorCallback(response) 
      {
        UiServices.hide_loader();
      });
    }
    else
    {
        UiServices.show_loader();
        $http(
        {
          method: 'GET',
          url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20ADDBENEFICIARYVERIFICATION%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.add_beneficiary.otp+'%20'+$scope.add_beneficiary.beneficiary_id,
          data:''
        }).then(function successCallback(response) 
        {
          UiServices.hide_loader();
          if(response.data[0].error_code==200)
          {
            $scope.new_beneficiary_modal.hide();
            $scope.add_beneficiary={};


            UiServices.show_loader();
                $http(
                {
                  method: 'GET',
                  url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20CHECKMEMBERREG%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password,
                  data:''
                }).then(function successCallback(response) 
                {
                  UiServices.hide_loader();
                  
                 // alert('response :'+response);
                 // console.log('res :'+JSON.stringify(response));
                  if(response.data.data.error_code==200)
                  {

                    $scope.customer_beneficiary=response.data.data.beneficiaryList;
                  }
                  else if(response.data.data.error_code==123)
                  {
                    //call to custoemer wallet to bank registration
                    //register now
                    $scope.register_now=true; 
                  }
                }, function errorCallback(response) 
                {
                  UiServices.hide_loader();
                 // alert('err'+response);
                });
          }
          else
          {

              

          }



          
        }, function errorCallback(response) 
        {
          UiServices.hide_loader();
        });




    }
      

  }
  $scope.delete_beneficiary_now=function(beneficiary_id)
  {

    UiServices.show_loader();
    $http(
    {
      method: 'GET',
      url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20DLTBENEFICIARY%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+beneficiary_id,
      data:''
    }).then(function successCallback(response) 
    {
      UiServices.hide_loader();
      if(response.data.data.error_code==200)
      {
        $scope.data={};
        //hey man open that popup to put otp
        
       
            var myPopup = $ionicPopup.show({
            template: '<div class = "list"><label class = "item item-input"><input type="tel" ng-model="data.wifi"></label></div>',
            title: 'Enter Otp',
            subTitle: '',
            scope: $scope,
            buttons: [
            { text: 'Cancel' },
            {
              text: '<b>send</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.wifi) 
                {
                  e.preventDefault();
                  
                } 
                else 
                {
                  
                  UiServices.show_loader();
                  $http(
                  {
                    method: 'GET',
                    url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20DLTBENEFICIARYVERIFICATION%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.data.wifi+'%20'+beneficiary_id,
                    data:''
                  }).then(function successCallback(response) 
                  {
                    UiServices.hide_loader();
                    console.log(JSON.stringify(response.data[0]));
                    if(response.data[0].error_code==200)
                    {
                      return $scope.data.wifi;
                    }
                    else
                    {
                      //did not verify otp

                    }
                    
                  }, function errorCallback(response) {
                    UiServices.hide_loader();

                  });
                }
              }
            }]
          })


        
        /*myPopup.then(function(res) 
        {
          console.log('Tapped!', res);
          //call that webservice;
           
        });*/
        



        //









 










      }
    }, function errorCallback(response) {
      UiServices.hide_loader();
      
    });



    //lassan





  }


  $scope.close_add_beneficiary_model=function()
  {
    $scope.new_beneficiary_modal.hide();
  }
  //paste modal here
  $ionicModal.fromTemplateUrl('templates/trans_from_wallet_to_bank.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.transfer_from_wallet_to_bank_modal = modal; 
   });
  $scope.open_modal_for_wallet_money_transfer=function(beneficiary_id)
  {

//    alert('shivam :'+$scope.register_now);
    $scope.data={};
    $scope.selected_benefiaciary_id_to_transfer=beneficiary_id;
    //console.log('check it now :'+beneficiary_id);
    $scope.transfer_from_wallet_to_bank_modal.show(); 
    //jabalpur



  }
  $scope.close_transfer_wallet_bank=function()
  {
    $scope.transfer_from_wallet_to_bank_modal.hide();
  }


 /* $scope.open_wallet_to_wallet=function()
  {
    $state.go('app.recharge');
  }
*/
  //check balance



  $rootScope.open_wallet_to_wallet=function(c)
  {
    if(c==0)
    {
      $scope.a.airplaneMode=false;
    }
    else if(c==1)
    {
      $scope.a.airplaneMode=true;
    }
     UiServices.show_loader();
    $http(
    {
      method: 'GET',
      url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20CHECKMEMBERREG%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password,
      data:''
    }).then(function successCallback(response) 
    {
      UiServices.hide_loader();
      

      //alert('res :'+JSON.stringify(response));
      if(response.data.data.error_code==200)
      {

        $scope.customer_beneficiary=response.data.data.beneficiaryList;
      }
      else if(response.data.data.error_code==123)
      {
        //call to custoemer wallet to bank registration
        //register now

        $scope.register_now=true; 
        if(c==1)
        {
          $scope.user_data=
          {
            mobile_no: $localStorage.user_data.mobile,
            password: $localStorage.user_data.password,
            otp_sent: false
          }
           $scope.customer_wallet_regitstration_for_to_bank.show();


        }
        
      }
    }, function errorCallback(response) 
    {
      UiServices.hide_loader();
     // alert('err'+response);
    });

//if register now is true than you should move it to new


//make sure u wanna change it


    $scope.wallet_transfer_modal.show();
    
  }
  $scope.close_syc_model=function()
  {

    $scope.wallet_transfer_modal.hide();
    $scope.customer_wallet_regitstration_for_to_bank.hide();


  }


  $scope.regiter_customer_wallet_to_bank=function()
  {

    //awesome
// 
   //     alert(JSON.stringify($scope.user_data));

        UiServices.show_loader();
        $http(
        {
          method: 'GET',
          url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20REGISTERUSER%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.user_data.pincode,
          data:''
        }).then(function successCallback(response) 
        {
          UiServices.hide_loader();

          if(response.status==200)
          {
             $scope.register_now=false;
             $scope.customer_wallet_regitstration_for_to_bank.hide();
            
          }        


        }, function errorCallback(response) 
        {
          UiServices.hide_loader();
          //alert('err'+response);
        });
    
    /*else
    {

       UiServices.show_loader();
        $http(
        {
          method: 'GET',
          url:'http://vedpay.com/api/Android.aspx?from=customer&message=6%20REGISTERUSEROTP%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.user_data.otp,
          data:''
        }).then(function successCallback(response) 
        {
          UiServices.hide_loader();
          if(response.data[0].error_code==200)
          { 
            //verified successfully
            $scope.register_now=false;
             $scope.customer_wallet_registstration_for_to_bank.hide();
          }
          else
          {

            //error

          }


        }, function errorCallback(response) 
        {
          UiServices.hide_loader();
          //alert('err'+response);
        });





    }  
    */











  }

  $scope.get_surcharge=function()
  {

    if($scope.data.amount<=5000 && $scope.data.amount!='')
    {
      UiServices.show_loader();
      $http(
        {
          method: 'GET',
          url:'http://vedpay.com/api/android.aspx?from=Customer&message=6%20GETSURCHARGEWALLET%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password+'%20'+$scope.data.amount,
          data:''
        }).then(function successCallback(response) 
        {
          var test=JSON.stringify(response.data).split(':')[1];
          var test_data=test.substring(test.indexOf('"')+1, test.lastIndexOf('"')).split(',');
          $scope.data.surcharge_amount=test_data[0];
          $scope.data.surcharge_total_amount=test_data[1];
          UiServices.hide_loader();
        }, function errorCallback(response) {
          UiServices.hide_loader();
        });

    }
    else if($scope.data.amount=='')
    {

      $scope.data.surcharge_amount='';

    }

      





  }
  $scope.done_wallet_transfer=function()
  {
    //hardcoded
    UiServices.show_loader();
    $http(
    {
      method: 'GET',
      url:'http://vedpay.com/api/Android.aspx?from=Customer&message=6%20SENDWALLET%20'+$localStorage.user_data.mobile+'%20'+$scope.wallet_transfer.password+'%20'+$scope.wallet_transfer.to+'%20'+$scope.wallet_transfer.amount,
      data:''
    }).then(function successCallback(response) 
    {
      var res=response.data.split(',');

      if(res[0]==1)
      {
        //done
        UiServices.show_loader();
	    $http(
	    {
	      method: 'GET',
	      url:'http://vedpay.com/api/android.aspx?from=Customer&message=6%20BAL%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password,
	      data:''
	    }).then(function successCallback(response) 
	    {
	      UiServices.hide_loader();
	      var result=response.data.substring(0, response.data.indexOf('\r')).split(',');
	      if(result[0]==1)
	      {
	        $rootScope.balance=result[2];
	      }
	      else
	      {
	        UiServices.hide_loader();
	      }
	    }, function errorCallback(response) {
	      UiServices.hide_loader();
	    });


       $scope.wallet_transfer={};
       UiServices.hide_loader();
       $ionicPopup.alert({
                template: '<div style="text-align:center">wallet transfer completed successfully</div>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                    
                    $scope.wallet_transfer_modal.hide();

                });
      }
      else
      {
        //error
        UiServices.hide_loader();
        $scope.wallet_transfer={};
        $ionicPopup.alert({
                template: '<div style="text-align:center">Error occurred</div>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                    
                    $scope.wallet_transfer_modal.hide();

                });


      }      


    }, function errorCallback(response) {
      UiServices.hide_loader();
      //alert('err'+response);
    });
  }

  $scope.close_wallet_to_wallet_modal=function()
  {
    
    $scope.wallet_transfer_modal.hide();
  }

});


app.controller('landingpageCtrl', function(Services, $scope, $state, $localStorage, $ionicModal, $ionicHistory, UiServices, $ionicPopup)
{
  

  $scope.$on('$ionicView.beforeEnter', function(e) 
  {
    if(($localStorage.user_data==undefined)|| (JSON.stringify($localStorage.user_data))==='{}')
    {
      $localStorage.user_data={};
    }
    else
    {
      $state.go('app.dashboard');
    }

  });


  $scope.open_login_page=function()
  {
    $state.go('login');
  }
  $scope.open_signup_page=function()
  {
    $state.go('signup');
  }
});

app.controller('signupCtrl', function($scope, $stateParams, Services, $ionicHistory, UiServices, $ionicPopup, $http, $ionicModal, $state, $localStorage) 
{
  $ionicModal.fromTemplateUrl('templates/otp_verification.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.otp_model = modal; 
   });

  $scope.user_data={};

  $scope.signup_now=function()
  {
    $scope.otp={};
     UiServices.show_loader();
     if(!$scope.user_data.sponserID){
		$scope.user_data.sponserID="100000";
	}
     $http(
      {
        method: 'GET',
        url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20REG%20'+$scope.user_data.mobile_no+'%20'+$scope.user_data.email+'%20'+$scope.user_data.password+'%20'+$scope.user_data.sponserID+'%20'+$scope.user_data.name,
        data:''
      }).then(function successCallback(response) 
      {
        var r_data=response.data.substring(0, response.data.indexOf('\r')).split(',');
        if(r_data[0]==1)
        {
          //ok got the response
          UiServices.hide_loader();
          $scope.otp_model.show();
        }
        else
        {
          UiServices.hide_loader();
          $ionicPopup.alert({
          template: '<center>'+response.data.substring(0, response.data.indexOf('\r')).split(',')[1]+'</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                                      


                });

          //some error occured
        }
      }, function errorCallback(response) {
        UiServices.hide_loader();
      });
  }
  $scope.close_otp_modal=function()
  {
    $scope.otp_model.hide();
  }
  $scope.submit_otp=function()
  {
    //hardcoded
    $http(
            {
              method: 'GET',
              url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20REGV%20'+$scope.user_data.mobile_no+'%20'+$scope.user_data.email+'%20'+$scope.user_data.password+'%20'+$scope.user_data.sponserID+'%20'+$scope.otp.val+'%20'+$scope.user_data.name,
              data:''
            }).then(function successCallback(response) 
            {
              UiServices.hide_loader();
              if(response.data.split(',')[0]==1)
              {

                  $localStorage.user_data=
                  {
                    ewallet_bal:0,
                    mobile: $scope.user_data.mobile_no,
                    email:$scope.user_data.email,
                    password: $scope.user_data.password
                };
                console.log(JSON.stringify($localStorage.user_data));
                $scope.otp_model.hide();
                $scope.otp={};
                $scope.user_data={};
                $state.go('app.dashboard');
              }
              else
              {

                $ionicPopup.alert({
                template: 'Some error occured',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                        

                });


              }
              
            }, function errorCallback(response) {
              UiServices.hide_loader();
            });
  }
  $scope.resend_otp=function()
  {

      $http(
            {
              method: 'GET',
              url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20RSOTP%20'+$scope.user_data.mobile_no+'%20'+$scope.user_data.email+'%20'+$scope.user_data.sponserID,
              data:''
            }).then(function successCallback(response) 
            {
              console.log(response);
              var x= response.data.substring(0, response.data.indexOf('\r')).split(',');
              if(x[0]==1)
              {
                UiServices.hide_loader();
                $ionicPopup.alert({
                template: 'OTP sent Successfully',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                        

                });


                //done
                //popup

              }
              else
              {
                UiServices.hide_loader();
                //try back after some time
                $ionicPopup.alert({
                template: '<center>Failed</center>',
                buttons:[{
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                        
                        
                });



              }

            }, function errorCallback(response) {
              UiServices.hide_loader();
            });




  }


});
app.controller('loginCtrl', function($scope,$stateParams, Services, $ionicModal, $localStorage, $state, UiServices, $rootScope, $ionicPopup, $http)
{
  
  $scope.loginData = {};
  
$scope.doLogin = function()
{
  
	UiServices.show_loader();
   $http(
    {
      method: 'GET',
      url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20LOGIN%20'+$scope.loginData.mobile+'%20'+$scope.loginData.password+'%201.1.1.1',
      data:''
    }).then(function successCallback(response) 
    {

      UiServices.hide_loader();
      //alert('response :'+JSON.stringify(response));
      var resdata=response.data;
      
      try
      {
            if(resdata.Info.split(',')[0]==='1')
            {
              var z=resdata.Info.split(',');
              UiServices.hide_loader();
              $rootScope.balance=z[3];
              //alert('rootScope :'+$rootScope.balance);
              var user_details=
              {
                msr_no: z[1],
                mobile: z[2],
                ewallet_bal:z[3],
                trans_pass: z[4],
                mem_id :z[5],
                email:z[6],
		name:z[7],
                password: $scope.loginData.password
              };
              $localStorage.user_data=user_details;
	     $rootScope.usrname=z[7];
	     $rootScope.mobile=z[2];
              $scope.loginData={};
              $state.go('app.dashboard');
           
            }
            


      }
      catch(err)
      {

              console.log(resdata);
              $ionicPopup.alert({
              template: '<center>Invalid Credential</center>',
                      buttons:[{
                          text:'ok', type: 'button-assertive'
                      }]
                      }).then(function(res)
                      {   
                              


                      });
      }


    }, function errorCallback(response) 
    {
      UiServices.hide_loader();        


    });


  }

 
  


});

app.controller('lastRechargeCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $ionicPopup, $http, $localStorage)
{


   UiServices.show_loader();
   $http(
    {
      method: 'GET',
      url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20LAST%20'+$localStorage.user_data.mobile,
      data:''
    }).then(function successCallback(response) 
    {

      
      UiServices.hide_loader();
      console.log(JSON.stringify(response.data));


      var res=response.data.split(',');


      $scope.data=[];
      for(var i=0; i<res.length; i++)
      {
        var p=res[i].split('-');
        var t=p[0].split(' ');
        var x={
          mobile_no : t[1],
          OperatorName: p[1],
          TransID: p[2],
          APITransID: p[3],
          ApiMessageNew: p[4],
          AddDate: p[5],
          RechargeAmount: p[6],
          RechargeStatus: p[7]
        };
        $scope.data.push(x);
      }
    }, function errorCallback(response) {
      UiServices.hide_loader();

    });




     $scope.go_back=function()
      {
        $ionicHistory.goBack();
      }



   
   


});

app.controller('rechargeCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup, $http, $cordovaDatePicker)
{

  //shivam please open model
  $scope.recharge_details={};
  $scope.temp={};
  $scope.selected={};
  $scope.selected.value=1;
  $scope.id=$stateParams.item;


	$scope.selectType=function(id){
		UiServices.show_loader();
		$http({
        		method: 'GET',
        		url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20OPTRS%20'+$localStorage.user_data.mobile+'%20'+id,
        		data:'',
        		headers: {
              			'Content-Type': 'application/json'
          		}
      		}).then(function successCallback(response) {
        		UiServices.hide_loader();
        		$scope.service_provider_data=response.data;
        		$scope.data1={};
      		}, function errorCallback(response) {
        		UiServices.hide_loader();
      		});

	}
	$scope.selectType($scope.id);
  $ionicModal.fromTemplateUrl('templates/select_service_provider.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.select_service_provider = modal; 
   });

  /*$scope.show_total=function()
  {

    console.log('shivma :'+JSON.stringify($scope.temp));





  }*/  
  $scope.go_back=function()
  {
    $ionicHistory.goBack(-1);
  }
    $ionicModal.fromTemplateUrl('templates/select_region.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.select_circle_modal = modal; 
   });

    $scope.selected_operator=function()
    {

     // alert(JSON.stringify($scope.temp));

    /*$scope.selected_operator_code=operator_code;*/
    //alert($scope.selected_operator_code);
    UiServices.show_loader();
    $http(
      {
        method: 'GET',
        url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20CIRCLE%20'+$localStorage.user_data.mobile,
        data:'',
        headers: {
              'Content-Type': 'application/json'
          }
      }).then(function successCallback(response) 
      {
        UiServices.hide_loader();
        var res=JSON.parse(response.data.replace('Circle', '"Circle"').substring(0, response.data.lastIndexOf(',')+2));
        $scope.circle_data=res.Circle;
        
      //  $scope.select_circle_modal.show();
      }, function errorCallback(response) 
      {
        UiServices.hide_loader();
      });

  }

  $ionicModal.fromTemplateUrl('templates/recharge_now_page.html',
   {
      scope: $scope
   }).then(function(modal)
   {
    $scope.open_recharge_now_modal = modal; 
   });

   $scope.circle_selected_data={};

   $scope.circle_selected=function()
   {
    
    //alert('shivam :'+JSON.stringify($scope.circle_selected_data));    



   /* $scope.recharge_amount={
      selected_circle: selected_circle,
      operator_id : operator_id
    };
*/

    //$scope.open_recharge_now_modal.show();
   }
   $scope.close_recharge_now_modal=function()
   {
    //console.log('go now');
    $scope.open_recharge_now_modal.hide();
   }


   UiServices.show_loader();
        $http(
        {
          method: 'GET',
          url: 'http://www.ip-api.com/json',
          data:''

        }).then(function successCallback(response) 
        {
          UiServices.hide_loader();
          $scope.public_ip_address=response.data.query;
          


        }, function errorCallback(response) {
          UiServices.hide_loader();
        });

    $scope.select_date=function()
    {


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

	   $cordovaDatePicker.show(options).then(function(date){
	       //alert(date);
          $scope.recharge_details.due_date=(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate());         

	   });
    }

   $scope.recharge_now=function()
   {

    window.MacAddress.getMacAddress(
      function(macAddress) 
      {
        $scope.mac_address=macAddress;

      },function(fail) {/*alert(fail);*/}
      );



  	$scope.mac_address='1.1.1.1';

  	console.log('$scope.recharge_details :'+JSON.stringify($scope.recharge_details));
    console.log('$scope.temp : '+JSON.stringify($scope.temp));
    console.log('scope.csd :'+JSON.stringify($scope.circle_selected_data));
    console.log('$scope.public_ip_address :'+JSON.stringify($scope.public_ip_address))
    console.log('$scope.recharge_details :'+JSON.stringify($scope.recharge_details));
	


  if($scope.recharge_details.promo_code==undefined)
	{
		$scope.recharge_details.promo_code='Nill';
	}
	if($scope.recharge_details.unit==undefined)
	{
		$scope.recharge_details.unit='nil';
	}
	if($scope.recharge_details.due_date==undefined)
	{
		$scope.recharge_details.due_date='nil';
	}
  





    UiServices.show_loader();
  $http(
    {
      method: 'GET',
      url: 'http://vedpay.com/api/android.aspx?from=Customer&message=6%20'+$localStorage.user_data.mobile+'%20'+$scope.temp.company_name+'%20'+$scope.recharge_details.mobile_no+'%20'+$scope.recharge_details.recharge_amount+'%20'+$scope.circle_selected_data.circle_name+'%200%20'+$scope.public_ip_address+'%20'+$scope.mac_address+'%20'+$localStorage.user_data.email+'%20'+$localStorage.user_data.mobile+'%20'+$scope.recharge_details.promo_code+'%20'+$scope.recharge_details.unit+'%20'+$scope.recharge_details.due_date+'%20nill%20nill%20nill',
      data:'',
      headers: {
            'Content-Type': 'application/json'
        }
    }).then(function successCallback(response) 
    {
      UiServices.hide_loader();
        
        var res=response.data.Result.split(','); 
        

//      var res=response.data.substring(0, (response.data.indexOf('\r')-2)).split(',');
      
      if(res[0]==1)
      {

      	UiServices.show_loader();
	    $http(
	    {
	      method: 'GET',
	      url:'http://vedpay.com/api/android.aspx?from=Customer&message=6%20BAL%20'+$localStorage.user_data.mobile+'%20'+$localStorage.user_data.password,
	      data:''
	    }).then(function successCallback(response) 
	    {
	      UiServices.hide_loader();
	      var result=response.data.substring(0, response.data.indexOf('\r')).split(',');
	      if(result[0]==1)
	      {
	        $rootScope.balance=result[2];
	      }
	      else
	      {
	        UiServices.hide_loader();
	      }
	    }, function errorCallback(response) {
	      UiServices.hide_loader();
	    });


              $ionicPopup.alert({
                  template: '<center>'+res[2]+'</center>',
                  buttons:[{
                      text:'ok', type: 'button-assertive'
                  }]
                  }).then(function(res)
                  { 
                  });
      }
      else
      {
                  $ionicPopup.alert({
                  template: '<center>'+res[2]+'</center>',
                  buttons:[{
                      text:'ok', type: 'button-assertive'
                  }]
                  }).then(function(res)
                  { 

                  });
      }

    }, function errorCallback(response) {

      UiServices.hide_loader();
    });

       













   }  

   $scope.close_recharge_now_modal=function()
   {
       $scope.open_recharge_now_modal.hide();
   }
  $scope.close_circle_selector_model=function()
  {
    $scope.select_circle_modal.hide();
  }
  $scope.close_service_provider_model=function()
  {
    $scope.select_service_provider.hide();
  }
});
app.controller('ewallet_transaction_historyCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup, $http, $filter){


  UiServices.show_loader();
  $http(
    {
      method: 'GET',
      url: 'http://vedpay.com/api/Android.aspx?from=Customer&message=6%20EWTRAN%20'+$localStorage.user_data.mobile+'%202000-01-02%202018-01-02',
      data:'',
      headers: {
            'Content-Type': 'application/json'
        }
    }).then(function successCallback(response) 
    {
      UiServices.hide_loader();
      var data=response.data;
      var d=data.substring(0, data.lastIndexOf(','));
      var e=d.replace('EWList', '"EWLIst"');
      $scope.show_data = JSON.parse(e.replace('/\//g', ''));
     // alert(JSON.stringify($scope.show_data));
    }, function errorCallback(response) {

      UiServices.hide_loader();
    });

  $scope.go_back=function()
  {
    $ionicHistory.goBack();
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


app.controller('add_walletCtrl', function($scope, $stateParams, Services, $ionicModal, $ionicHistory, $state, UiServices, $timeout, $rootScope, $localStorage, $ionicPopup, $http){
  

UiServices.show_loader();
      $http(
      {
        method: 'GET',
        url:'http://vedpay.com/api/android.aspx?from=Customer&message=6%20FBANK%20'+$localStorage.user_data.mobile,
        data:''
      }).then(function successCallback(response) 
      {
        UiServices.hide_loader();
        var data=response.data;
        var data1=data.replace('FBANK', '"FBANK"');
         console.log(data1);




      }, function errorCallback(response) 
      {
        UiServices.hide_loader();
      });





});
