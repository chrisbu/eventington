(function(eventington, $, undefined) {
  
  (function(model, $, undefined) {
    
    /*
     * return a new location object.
     */
    model.createEvent = function() {
      var newEvent=  {
        "date": "",
        "time": "",
        "location": eventington.model.createLocation(),
        "title": ""
      };
      
      return newEvent;
    }
    
  }(eventington.model = eventington.model || {}, $)); //self executing anonymous functon to create the namespace methods
  
}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods