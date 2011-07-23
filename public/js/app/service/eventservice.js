(function(eventington, $, undefined) {

  /*
   * Create the service namespace within eventington.
   */
  (function(eventservice, $, undefined) {
    
    /*
     * Converts a location, eventTitle, eventDate into an event model object, converting the location name into 
     * a lat + lng. 
     * 
     * @param locationName
     * @param eventTitle
     * @param eventDate
     */
    eventservice.saveEvent = function(err, success, locationName, eventTitle, eventDate) {
      log("in eventService.saveEvent");
      
      var onGeocodeError = function(data) {
        log("in eventService.saveEvent.onGeocodeError");
        eventington.ui.showError(data);
        err();
      };
      
      /*
       * If we manage to convert the name into a lat + lng, then we can save the record.
       */
      var onGeocodeSuccess = function(location) {
        log("in eventService.saveEvent.onGeocodeSuccess");
        var newEvent = eventington.model.createEvent();
        newEvent.location = location;
        newEvent.date = eventDate;
        newEvent.time = "";
        newEvent.title = eventTitle;
        
        var onSaveError = function(data) {
          log("in eventService.saveEvent.onGeocodeSuccess.onSaveError");
          eventington.ui.showError(data);
          err();
        };
        
        var onSaveSuccess = function(data) {
          log("in eventService.saveEvent.onGeocodeSuccess.onSaveSuccess");
          if (data != "OK") {
            onSaveError("There was an error adding your event");
          }
          else {
            success();
          }
        };
        
        //now save the event.
        eventington.serverdao.saveEvent(onSaveError, onSaveSuccess, newEvent);
      };
      
      eventington.geoservice.getCoordFromName(onGeocodeError, onGeocodeSuccess, locationName);
      
      
    };
    
  }(eventington.eventservice = eventington.eventservice || {}, $)); //self executing anonymous functon to create the namespace methods  

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods