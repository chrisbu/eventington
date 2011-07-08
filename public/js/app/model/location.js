(function(eventington, $, undefined) {
  
  (function(model, $, undefined) {
    
    /*
     * return a new location object.
     */
    model.createLocation = function() {
      var newLocation =  {
        "name": "",
        "lat": "0.00",
        "lng": "0.00"
      };
      
      return newLocation;
    }
    
  }(eventington.model = eventington.model || {}, $)); //self executing anonymous functon to create the namespace methods
  
}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods