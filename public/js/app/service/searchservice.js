(function(eventington, $, undefined) {
  
  /*
   * Create the service namespace within eventington.
   */
  (function(searchservice, $, undefined) {
  	
  	    /*
     * Returns a list of locations which match the partialName parameter.
     * Useful for autocomplete.
     * 
     * @param err
     *  - error callback
     * @param success 
     *  - success callback
     * @param partialName  
     */
    searchservice.searchLocation = function(err, success, partialName) {
      
      var onError = function(data) {
        err(data);  
      };
      
      var onSuccess = function(data) {
        success(data);
      };
      
      //pass the call down to the dao layer.
      eventington.serverdao.searchLocation(onError, onSuccess, locationString);
    };
    
    searchservice.searchEvents = function(err, success, location, startDate, endDate) {
    	log("in searchService.searchEvents");
    	log(location);
    	
    	var onError = function(data) {
    		err(data);
    	};
    	
    	var onSuccess = function(events) {
    		success(events);
    	};
    	
    	eventington.serverdao.searchEvents(onError, onSuccess, location, startDate, endDate);
    };
    
  	
  }(eventington.searchservice = eventington.searchservice || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods
