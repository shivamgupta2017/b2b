"use strict";
app.filter('ItemsFilter', function() {    
    return function(items, query) {
       
       console.log('shivam 1'+query);
       console.log('shivam 2:'+JSON.stringify(items));
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
              if (letterMatch.test(item.product_name.substring(0, query.length))) 
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
