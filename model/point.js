/*
 * Point.js - provides a class which can lookup from geolocation cache in mongodb. 
 */

module.exports = function(app) {

  var geocodeCollection = app.geocodeCollection;
  
  

  /*
   * Point class which which can be instantiated.
   */
  var Point = function() {
    this.latitude = 0;
    this.longitude = 0;    
  }
  
  /*
   * Function to convert the latitude to a name, based upon what we already have cached.  
   * @param err
   *  - Callback which looks like function(errorString) {} 
   *    If the item doesn't appear in the cache, or there is some other error, then we can't reverse geocode
   * @param success
   *  - Callback which looks like function(locationName) {}
   */
  Point.prototype.reverseGeocode = function(err, success) {
    //TODO: server side reverse geocode
    err("Not Implemented");
  };
  
  
  /*
   * Constructor
   * @param lat
   *  - latitude
   * @param lng
   *  - longitude
   */
  var createPoint = function(lat, lng) {
    var result = new Point();
    result.latitude = lat;
    result.longitude = lng;
    return result;
  }


};