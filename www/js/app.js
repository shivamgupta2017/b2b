// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
"use strict";
var app = angular.module('starter', ['ionic','ngStorage']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    var notificationOpenedCallback = function(jsonData) 
    {
      
      var state=jsonData.notification.payload.additionalData.state;
     delete jsonData.notification.payload.additionalData.state;
     $state.go(state,jsonData.notification.payload.additionalData);
    };

      window.plugins.OneSignal.startInit("93c7e511-bea9-41fe-93e5-6226c84c3619").handleNotificationOpened(notificationOpenedCallback).endInit();

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

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.recent_orders', {
      url: '/recent_orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/recent_orders.html',
          controller: 'recent_ordersCtrl'
        }
      }
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

  .state('app.view_order_details', {
    url: '/view_order_details/:order_id/:order_verification/',
    views: {
      'menuContent': {
        templateUrl: 'templates/view_order_details.html',
        controller: 'view_order_detailsCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })


  ;
  $urlRouterProvider.otherwise('/app/dashboard');
});
