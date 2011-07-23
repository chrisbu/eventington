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
    
    /*
     * If the location hasn't been geocoded to a lat/lng, then it gets the lat lng value, 
     * and then performs a search. 
     * 
     *
     * @err
     * @success
     *  - event array
     * @location
     * @startDate
     * @endDate
     */
    searchservice.searchEvents = function(err, success, location, startDate, endDate) {
    	log("in searchService.searchEvents");
    	log(location);
    	
    	var onError = function(data) {
    		err(data);
    	};
    	
    	var onSuccess = function(events) {
    		success(events);
    	};
    	
    	if (location.lat === "" || location.lng === "" || 
  	     location.lat === undefined || location.lng === undefined || 
  	     location.lat === null || location.lng === null) {
  	       
  	       log("searchservice.searchEvents unknown lat / lng");
  	       //location lat / lng is not defined.
  	       
  	       var onGeocodeSuccess = function(geocodedLocation) {
  	         log("in searchservice.searchEvents.onGeocodeSuccess")
  	         location = geocodedLocation;
  	         
  	         eventington.serverdao.searchEvents(onError, onSuccess, geocodedLocation, startDate, endDate);
  	       };
  	       
  	       //geocode
  	       eventington.geoservice.getCoordFromName(onError, onGeocodeSuccess, location.name);
    	  
    	}
    	else {
    	  //no need to geocode, so just search.
        eventington.serverdao.searchEvents(onError, onSuccess, location, startDate, endDate);  
    	}
    	
    	
    };
    
  	
  }(eventington.searchservice = eventington.searchservice || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods
