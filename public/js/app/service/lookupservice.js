/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the service namespace within eventington.
   */
  (function(lookupservice, $, undefined) {
    
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
    lookupservice.searchLocation = function(err, success, partialName) {
      
      var onError = function(data) {
        err(data);  
      };
      
      var onSuccess = function(data) {
        success(data);
      };
      
      //pass the call down to the dao layer.
      eventington.serverdao.searchLocation(onError, onSuccess, locationString);
    };
    
    
  }(eventington.lookupservice = eventington.lookupservice || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods

