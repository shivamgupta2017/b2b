"use strict";
app.filter('ItemsFilter', function() {    
    return function(items, query) {
       

 //      alert('shivam :'+JSON.stringify(items));
       //alert('gupta :'+JSON.stringify(query));
       
       var filtered = [];
       var letterMatch = new RegExp(query, 'i');
    for (var i = 0; i < items.length; i++) 
    {
      var item = items[i];
      if (query) 
      {
        if (letterMatch.test(item.title.substring(0, query.length))) 
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
               

    };
});
