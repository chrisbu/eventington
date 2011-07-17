/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the dao namespace within eventington.
   */
  (function(browserdao, $, undefined) {
    
    /*
     * lookup in browser local storage for matching name from coordinate. 
     */
    browserdao.getNameFromCoord = function(err, success, lat, lng) {
      err("Not implemented");
    };
    
    /*
     * lookup in browser local storage for matching coordinages from a name.
     */
    browserdao.getCoordFromName = function(err, success, name) {
      err("Not implemented");
    };
    
    /*
     * Adds a location to the client side local storage (if available).
     * 
     */
    browserdao.addLocation = function(location) {
      //TODO: Add to local cache
    };
    
    
  }(eventington.browserdao = eventington.browserdao || {}, $)); //self executing anonymous functon to create the namespace methods
  
}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods