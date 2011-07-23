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
    
    /*
     * Converts coordinates into a name.
     * 
     * @param err
     * @param success
     *  - returns location object
     * @param lat
     * @param lng
     */
    googledao.getNameFromCoord = function(err, success, lat, lng) {
      log("in googledao.getNameFromCoord");
      var latlng = new google.maps.LatLng(lat, lng);
      
      var onGoogleApiResult = function(results, status) {
        log("googledao.getNameFromCoord.onGoogleApiResult");
        log(results);
        log(status);
        if (status == google.maps.GeocoderStatus.OK) {
          
          var location = eventington.model.createLocation();
          if (results.length > 1) {
            location.name = results[1].formatted_address;
          }
          else if (results.length > 0) {
              location.name = results[0].formatted_address;
          }
          else {
            //no results, so raise an error
            err("No results retuned");
          }
          location.lat = lat;
          location.lng = lng;
          
          success(location); 
          
        }
        else {
          err("Error in geocode.getNameFromCoord");
        }
      };
      
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': latlng}, onGoogleApiResult);
      
    };
    
    /*
     * Converts a name into a coordingate.
     *  
     * @param err
     * @param success
     *  - returns location object.
     * @param locationName
     */
    googledao.getCoordFromName = function(err, success, locationName) {
      log("in googledao.getCoordFromName");
      
      var onGoogleApiResult = function(results, status) {
        log("in googledao.getCoordFromName.onGoogleApiResult");
        if (status == google.maps.GeocoderStatus.OK) {
          log(results);
          var location = eventington.model.createLocation();
          location.name = locationName;
          location.lat = results[0].geometry.location.lat();
          location.lng = results[0].geometry.location.lng();
          
          success(location);
        }
        else {
          log(results);
          log(status);
          err("Error with google coord from name");
        }
        
      };
      
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': locationName}, onGoogleApiResult);
    };
    
    
    
    
    
  }(eventington.googledao = eventington.googledao || {}, $)); //self executing anonymous functon to create the namespace methods

}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods