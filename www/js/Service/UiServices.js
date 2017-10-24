"use strict";
app.factory('UiServices', function($http, $rootScope, $timeout,$ionicLoading, $q, $ionicPopup, $state)	{
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
                    text:'ok', type: 'button-assertive'
                }]
                }).then(function(res)
                {   
                        
                });
            },
            show_loader: function()
            {
               $ionicLoading.show(
                {   showBackdrop: false,
                    template: '<ion-spinner icon="android" class="spinner-positive"></ion-spinner>' 
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

