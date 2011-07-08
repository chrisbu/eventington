/*
 * Data access to the google mapping api's
 */


/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the dao namespace within eventington.
   */
  (function(googledao, $, undefined) {
    
    googledao.getNameFromCoord = function(err, success, lat, lng) {
      //TODO: - google api - get name from coordinate (geocode)
      
      err("Not Implemented");
    };
    
    googledao.getCoordFromName = function(err, success, name) {
      //TODO: - google api - get coordinate from name (reverse geocode)
      
      err("Not Implemented");
    };
    
    
    
    
    
  }(eventington.googledao = eventington.googledao || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods