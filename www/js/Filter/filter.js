"use strict";
app.filter('ItemsFilter', function() {    
    return function(items) {
       
       var ret = new Date(parseInt(items.substring(items.indexOf('(')+1, items.indexOf(')'))));
        
        var rr=ret.toDateString();
        return rr;       
       //return ret.toString('MM/dd/yy');
    };
});
