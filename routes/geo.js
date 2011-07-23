/*
 * Provides routes for cached geocode lookups and saving geocode data
 */

module.exports = function(app) {

  var getLocation = function(req, res) {
    console.log("routes/geo.js in getLocation");
    
    //TODO: Determine from the data whether we are tring to convert a location to a lat lng or a lat lng to a location. 
    
    var location = {};
    location.name = "My Place";
    location.lat = 52.123;
    location.lng = 0.123;
    
    //res.send(location);
    res.send(false);    
  };
  
  var saveLocation = function(req, res) {
    console.log("routes/geo.js in saveLocation");
    console.log(req.body);
    var location = {};
    location.name = req.body.name;
    location.lat = req.body.lat;
    location.lng = req.body.lng;
    
    res.send(true);
    
  };
  
  
  app.get('/geo', getLocation);
  app.post('/geo', saveLocation)
  
}