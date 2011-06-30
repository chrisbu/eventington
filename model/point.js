/*
 * Point.js - provides a class which can lookup from geolocation cache in mongodb. 
 */
var Point =  function(app, lat, lng) {
  
  this.latitude = lat;
  this.longitude = lng;
  this.locations = app.locations; //set the locations collection
  
};


/*
 * Return a location array for the latitude and longitude
 */
Point.prototype.getLocation = function() {
  var location = [this.latitude, this.longitude];
  return location;  
};

/*
 * Reverse geocode for the point at this location.
 * 
 * 
 * @param onSuccess
 *  - calls onSuccess(locationName) if the name exists in the local cache
 * 
 * @param onError
 *  - calls onError(errorMessage) if the name doesn't exist in the local cache. 
 *  
 * 
 * 
 */
Point.prototype.reverseGeocode = function(onError, onSuccess) {
  //DONE: server side reverse geocode
  
  
  var locationFilter = {$near: this.getLocation(), $maxDistance: 1};

  this.locations.find(locationFilter, function(err, cursor) {
      if (err) { console.log(err);}
      
      cursor.toArray(function(err, items) {      
        if (err) {
          onError(err);          
        } 
        else if (items === null || items.length > 0) {
          //no data returned
          onError("no data returned");
        }    
        else {
          //success
          //callback when we get the items.  Just return them as json.          
          onSuccess(items);
        }
        
      });
        
    });
};



module.exports.Point = Point;
