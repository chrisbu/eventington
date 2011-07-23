/*
 * Provides routes for cached geocode lookups and saving geocode data
 */

module.exports = function(app) {

  /*
   * Allows saving events into the database.
   */
  var saveEvent = function(req, res) {
    console.log("routes/event.js in saveEvent");
    console.log(req.body);
    
    var postData = req.body;
    
    var eventRecord = {
      loc: {
        "long": parseFloat(postData.location.lng),
        "lat": parseFloat(postData.location.lat)
      },
      title: postData.title,
      date: postData.date,
      time: postData.time
    };
    
    console.log("Saving event record:");
    console.log(eventRecord);
    
    
    
    app.events.insert(eventRecord, function(err) {
      if (err) { console.log(err); }
    });
    
    res.send(true);    
  };
  
  app.post('/event', saveEvent);
  
}