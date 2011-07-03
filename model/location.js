/*
 * Location object which represents a named latitude and longitude point.
 */
var Locaton = function(lat, lng, name) {
  this.lat = lat;
  this.lng = lng;
  this.name = name;
};


module.exports.Location = Location;
