"use strict";
app.factory('Services', function($http, $rootScope, $timeout,$ionicLoading, $q, Constant) {
    $http.defaults.headers.post = "application/json";
    return {
        webServiceCallPost: function(data, action) 
        {   

             var deferred = $q.defer();
            $http({
                 method: 'POST',
                 url: Constant.base_url.service_url+action,
                 data: JSON.stringify(data)

              }).then(function successCallback(response) 
              {         
                    deferred.resolve(response);     
                    
              }, function errorCallback(response) 
              {
                    deferred.reject(response);
              });
              
            return deferred.promise;

        },
        webServiceCallGoogleGet: function(data, action) {
            var deferred = $q.defer();
          //  if (navigator.connection.type != "none") {
                return $.ajax({
                    type: "GET",
                    url: "https://www.googleapis.com/plus/v1/people/me?access_token=" + action,
                    crossDomain: true,
                    dataType: "json",
                    timeout: 2000000,
                    async: true,
                    success: function(response) {
                        deferred.resolve();
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        $ionicLoading.hide();
                        if (xhr.status == 0) {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        } else if (xhr.status == 404) {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        } else {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        }
                    },
                    beforeSend: function() {},
                    complete: function() {}
                });
           /* } else {
                window.plugins.toast.showShortBottom($translate.instant("checkNetWorkConnection"));
                $ionicLoading.hide();
                var response1 = [{
                    "data": []
                }, {
                    "response": {
                        "message": $translate.instant("checkNetWorkConnection"),
                        "status": 0
                    }
                }];
                return $http.get('').then(function(response) {
                    return response1;
                });
            }*/
        },
        forgotPasswordService: function(data, action) {


            var deferred = $q.defer();
          //  if (navigator.connection.type != "none") {
                return $.ajax({
                    type: "POST",
                    url: appConst.serviceUrl.service_login + action,
                    crossDomain: true,
                    dataType: "json",
                    data: data,
                    timeout: 20000,
                    async: true,
                    success: function(response) {
                        console.log("response    "+JSON.stringify(response));
                        deferred.resolve();
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        $ionicLoading.hide();
                        if (xhr.status == 0) {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        } else if (xhr.status == 404) {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        } else {
                            window.plugins.toast.showShortBottom($translate.instant("timedOutError"));
                        }
                    },
                    beforeSend: function() {},
                    complete: function() {}
                });
           /* } else {
                window.plugins.toast.showShortBottom($translate.instant("checkNetWorkConnection"));
                $ionicLoading.hide();
                var response1 = [{
                    "data": []
                }, {
                    "response": {
                        "message": $translate.instant("checkNetWorkConnection"),
                        "status": 0
                    }
                }];
                return $http.get('').then(function(response) {
                    return response1;
                });
            }*/
        },
        webServiceCallGet: function(action) {
            return $http.get(appConst.serviceUrl.service + action).then(function(response) {
                return response;
            });
        },
        pa: function(object,string, isShown) {
		if(isShown){
            		//alert(string+' '+JSON.stringify(object)+' '+string);
		}
        },
        pc: function(object,string, isShown) {
		if(isShown){
            		console.log(string+' '+JSON.stringify(object)+' '+string);
		}
        }
    }
});

app.service('findItemIndex', function($q) {
    this.findItemIndexInCartList = function(Array, property, action, size_id) 
    {
            var result = -1;
            angular.forEach(Array, function(value, index) {
                if ((value.item_id == action) && (value.size_id==size_id)) {
                    result = index;
                    
                }
            });
            return result;
    },
        this.findAddonIndexInCartList = function(Array, property, action) {
            var defer = $q.defer();
            var result = -1;
            if (Array.length == 0) {
                defer.resolve(-1);
            } else 
            {
//                alert('hello :'+);
           //      alert('action :'+action);

                angular.forEach(Array, function(value, key) {
                    if (value.addon_id == action) {
                        result = key;
                    }
                    if(Array.length-1 == key){
                        defer.resolve(result);
                    }
                });

            }
            return defer.promise;
        },
        this.findItemIndexInAddons = function(Array, property, action,action2) 
        {
            var result = -1;
            
                angular.forEach(Array, function(value, index)
                 {
                    if ((value.item_id == action)&&(value.size_id==action2)) 
                    {
                        result = index;                       
                    }
                });
            
            return result;
        }
});

