/*
 * Service Layer which will be called by the UI.
 * 
 * This provides an abstracted layer to the UI so that it can load, search, geocode etc...
 * without having to worry about where the data came from (eg, local browser storage, server, google etc...)
 * 
 *  - getNameFromCoord
 *  - getCoordFromName
 */

/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the service namespace within eventington.
   */
  (function(geoservice, $, undefined) {
    
    /*
     * Lookup a location name from a co-ordinate.  
     * This is equivalent to the locality name, rather than a specific address.
     * 
     * Calling this function will try the following
     * - look in browser local storage (local location cache)
     * - look on server
     * - look on google
     * 
     * The result will the go back up the tree, caching as required
     * so if found on google, it will be cached on the server and in the local browser,
     * if found on the server, it will be cached in the local browser.
     * 
     * @param err
     *  - error callback
     * @param success
     *  - success callback - a location object is passed in.
     * @param lat
     *  - latitude value
     * @param lng
     *  - longitude value
     */
    geoservice.getNameFromCoord = function(err, success, lat, lng) {

      //setup callback functions for success and error.
      var addToLocalCache = function(location) {
        browserdao.addLocationForCoord(location);        
      };
      
      var addToServerCache = function(location) {
        serverdao.saveLocation(function() {}, function() {}, location);
      };
      
      var onGoogleError = function(error) {
        //Aargh! we can't get any location for this coordinate, so raise the error back to the caller.
        err(error);        
      };
      
      var onGoogleSuccess = function(location) {
        
      };
      
      var onServerError = function(error) {
        //we didn't have the data on the server, so call google.
        eventington.googledao.getNameFromCoord(onGoogleError, onGoogleSuccess, lat, lng);
      };
      
      var onServerSuccess = function(location) {
        //store in the local cache
        addToLocalCache(location);
        
        //call success method to exit.
        success(location);
      };
      
      var onLocalCacheError = function(error) {
        //if we can't lookup from the local cache, or get no data, then try looking up from the server.
        eventington.serverdao.getNameFromCoord(onServerError, onServerSuccess, lat, lng);
      };
      
      var onLocalCacheSuccess = function(location) {
        success(location); // fine, exit.
      };
      
      
      //start procesing here.
      eventington.browserdao.getNameFromCoord(onLocalCacheError, onLocalCacheSuccess, lat, lng);
    };
    
    /*
     * Lookup a coordinate from a location.
     * 
     *   
     * This is equivalent to the locality name, rather than a specific address.
     * 
     * Calling this function will try the following
     * - look in browser local storage (local location cache)
     * - look on server
     * - look on google
     * 
     * The result will the go back up the tree, caching as required
     * so if found on google, it will be cached on the server and in the local browser,
     * if found on the server, it will be cached in the localbrowser.
     * 
     * @param err
     *  - error callback
     * @param success
     *  - success callback - a location object is passed in.
     * @param name
     *  - name to try and convert to lat/lng value. 
     */
    geoservice.getCoordFromName = function(err, success, name) {
      err("Not implemented");
    };
    
  }(eventington.geoservice = eventington.geoservice || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods

