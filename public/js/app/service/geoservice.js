/*
 * Service Layer which will be called by the UI.
 * 
 * This provides an abstracted layer to the UI so that it can load, search, geocode etc...
 * without having to worry about where the data came from (eg, local browser storage, server, google etc...)
 * 
 *  - getNameFromCoord
 *  - getCoordFromName
 *  - getLocationFromBrowser
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
      log("geoservice.getNameFromCoord")


      //setup callback functions for success and error.
      var addToLocalCache = function(location) {
        log("geoservice.getNameFromCoord.addToLocalCache");
        eventington.browserdao.addLocation(location);        
      };
      
      var addToServerCache = function(location) {
        log("geoservice.getNameFromCoord.addToServerCache");
        eventington.serverdao.saveLocation(function() {}, function() {}, location);
      };
      
      var onGoogleError = function(error) {
        log("geoservice.getNameFromCoord.onGoogleError");
        //Aargh! we can't get any location for this coordinate, so raise the error back to the caller.
        err(error);        
      };
      
      var onGoogleSuccess = function(location) {
        log("geoservice.getNameFromCoord.onGoogleSuccess");
        //hoorah - we got a location back from google.
        //save it locally and on the server
        addToServerCache(location);
        addTolocalCache(location);
        
        success(location); //call back to the success to exit.
      };
      
      var onServerError = function(error) {
        log("geoservice.getNameFromCoord.onServerError");
        //we didn't have the data on the server, so call google.
        eventington.googledao.getNameFromCoord(onGoogleError, onGoogleSuccess, lat, lng);
      };
      
      var onServerSuccess = function(location) {
        log("geoservice.getNameFromCoord.onServerSuccess");
        
        //store in the local cache
        addToLocalCache(location);
        
        //call success method to exit.
        success(location);
      };
      
      var onLocalCacheError = function(error) {
        log("geoservice.getNameFromCoord.onLocalCacheError");
        //if we can't lookup from the local cache, or get no data, then try looking up from the server.
        eventington.serverdao.getNameFromCoord(onServerError, onServerSuccess, lat, lng);
      };
      
      var onLocalCacheSuccess = function(location) {
        log("geoservice.getNameFromCoord.onLocalCacheSuccess");
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
     * The result will then go back up the tree, caching as required
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
      err("Not implemented: geoservice.getCoordFromName");
    };
    
    /*
     * Tries to use browser geolocation to get the current location from the browser.
     * 
     * @param err
     *   - error callback
     * 
     * @param success
     *   - success callback - passing in a location object.
     */
    geoservice.getLocationFromBrowser = function(err, success) {
      log("geoservice.getLocationFromBrowser");
      if (Modernizr.geolocation) {
        //they have geolocation enabled.
        
        
        var options = {
          maximumAge: 120000,  //two mins old is ok.
          enableHighAccuracy: false //don't need to be highly accurate - we're searching for miles around, not streets away.
        };
        
        //on error function
        var onError = function(error) {
          eventington.ui.showError(error);
        };
        
        var onSuccess = function(position) {
          eventington.geoservice.getNameFromCoord(
                  onError, 
                  function(location) {
                    //callback passed into the original method
                    success(location);
                  },
                  position.coords.latitude, 
                  position.coords.longitude
          );
        };
        
        //do the geolocation lookup using html5 browser api.
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);    
      }
    };
    
  }(eventington.geoservice = eventington.geoservice || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods


