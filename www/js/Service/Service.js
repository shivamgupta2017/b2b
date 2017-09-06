"use strict";
app.factory('Services', function($http, $rootScope, $timeout,$ionicLoading, $q, Constant, UiServices) {
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
        }
    }
});
