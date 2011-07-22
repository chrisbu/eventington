(function(eventington, $, undefined) {

  /*
   * Create the service namespace within eventington.
   */
  (function(eventserice, $, undefined) {
    
    /*
     * Converts a location, eventTitle, eventDate into an event model object, converting the location name into 
     * a lat + lng. 
     * 
     * @param locationName
     * @param eventTitle
     * @param eventDate
     */
    eventservice.saveEvent = function(locationName, eventTitle, eventDate) {
      
      var onError = function(data) {
        eventington.ui.showError(data);  
      };
      
      var onSuccess = function(data) {
        eventington.ui.showError("Not implemented");
      };
      
      eventington.serverdao.saveEvent
      
      
      
    };
    
  }(eventington.eventservice = eventington.eventservice || {}, $)); //self executing anonymous functon to create the namespace methods  

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods