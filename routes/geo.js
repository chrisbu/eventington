/*
 * Provides routes for cached geocode lookups and saving geocode data
 */

module.exports = function(app) {

  var getLocation = function(req, res) {
    console.log("in getLocation");
    var location = {};
    location.name = "My Place";
    location.lat = 52.123;
    location.lng = 0.123;
    
    res.send(location);    
  };
  
  var saveLocation = function(req, res) {
    console.log("in saveLocation");
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