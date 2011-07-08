/*
 * Service Layer which will be called by the UI.
 * 
 * This provides an abstracted layer to the UI so that it can load, search, geocode etc...
 * without having to worry about where the data came from (eg, local browser storage, server, google etc...)
 * 
 * 
 * Functions:
 *  - getNameFromCoord
 *  - getCoordFromName
 *  - searchLocation
 *  - searchEvents
 *  - saveEvent
 *  - saveLocation
 */

/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the service namespace within eventington.
   */
  (function(service, $, undefined) {
    
    
    
  }(eventington.service = eventington.service || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods