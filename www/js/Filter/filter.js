"use strict";
app.filter('ItemsFilter', function() {    
    return function(items, query) {
       
       
       //alert('gupta :'+JSON.stringify(query));
       if(items!=undefined)
       {
          var filtered = [];
          var letterMatch = new RegExp(query, 'i');
          for (var i = 0; i < items.length; i++) 
          {
            var item = items[i];
            if (query) 
            { 
              if (letterMatch.test(item.product_name)) 
              {
                filtered.push(item);
              }
            } 
            else 
            {
              filtered.push(item);
            }
          }
        return filtered;



      }
       
                   

    };
});
