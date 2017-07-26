"use strict";
app.factory('UiServices', function($http, $rootScope, $timeout,$ionicLoading, $q, Constant, $ionicPopup)	{
		return {
             confirmation_popup: function(title, template) 
            {
      			var deffered = $q.defer();   
            	var confirm = $ionicPopup.confirm({
            		title: title,
            		template: template,
            	});
            	confirm.then(function(res){
            		deffered.resolve();
            	});

            	return deffered.promise;
        	},
            alert_popup: function(template)
            {
                $ionicPopup.alert({
                template: template,
                buttons:[{
                    text:'ok',
                    Type: 'button-clear'

                }]
                }).then(function(res)
                {   
                    alert('res :'+res);
                });
            },
            show_loader: function()
            {
               $ionicLoading.show(
                {   showBackdrop: false,
                    template: '<ion-spinner icon="bubbles" class="spinner-assertive"></ion-spinner>' 
                });                 
            },
            hide_loader: function()
            {
                $ionicLoading.hide();
            }


    	};	
	});
app.factory('Additional_services', function()
{
    return {
        show_alert: function(your_name, data)
        {
            alert(your_name+':'+data);
        }
    };
}); 	

app.factory('$cordovaDatePicker', ['$window', '$q', function ($window, $q) {
    
    return {
      show: function (options) {
        var q = $q.defer();
        options = options || {date: new Date(), mode: 'date'};
        $window.datePicker.show(options, function (date) {
          q.resolve(date);
        }, function (error){
          q.reject(error);
        });
        return q.promise;
      }
    };
  }]);