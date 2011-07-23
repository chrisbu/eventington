/*
 * Provides routes for cached geocode lookups and saving geocode data
 */

module.exports = function(app) {

  var saveEvent = function(req, res) {
    console.log("routes/event.js in saveEvent");
    console.log(req.body);
    res.send(true);    
  };
  
  app.post('/event', saveEvent);
  
}