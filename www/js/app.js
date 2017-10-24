// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
"use strict";
var app = angular.module('starter', ['ionic','ngStorage']);

app.run(function($ionicPlatform, $state, $localStorage, $ionicHistory) 
{
  $ionicPlatform.ready(function() 
  {
    document.addEventListener("offline", offline, false);
    document.addEventListener("online", online, false);
    
    function offline() 
    {
      $state.go('network_connection');
    }
    function online() 
    {
      $ionicHistory.goBack(-1);
    }

      

    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })

    .state('app.last_recharge', {
      url: '/recent_orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/last_recharge.html',
          controller: 'lastRechargeCtrl'
        }
      }
    })

    .state('app.ewallet_transaction_history', {
      url: '/recent_wallet_trans',
      views: {
        'menuContent': {
          templateUrl: 'templates/ewallet_trans_history.html',
          controller: 'ewallet_transaction_historyCtrl'
        }
      }
    })
/**/
  
  .state('app.add_wallet_balance_now', {
      url: '/add_wallet_balance_now',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_wallet_balance.html',
          controller: 'add_walletCtrl'
        }
      }
    })


   .state('app.recharge', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })

   .state('app.datacard', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/datacard_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })
   .state('app.dth', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/dth_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })
   .state('app.landline', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/landline_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })

   .state('app.electricity', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/electricity_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })
   .state('app.gas', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/gas_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })
   .state('app.insurance', {
      url: '/recharges/:item/',
      views: {
        'menuContent': {
          templateUrl: 'templates/insurance_recharge_page.html',
          controller: 'rechargeCtrl'
        }
      }
    })


 
  .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    
  })
  .state('signup', {
    url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
    
  })

  .state('landing', {
    url: '/landing',
        templateUrl: 'templates/landing.html',
        controller: 'landingpageCtrl'
    
  })

  .state('network_connection', {
    url: '/network_connection',
    templateUrl: 'templates/network_connection.html',
    controller: 'no_network_ConnectionCtrl'
  });

  
  $urlRouterProvider.otherwise('/landing');
});
