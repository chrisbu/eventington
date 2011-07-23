/*
 * Provided for search functionality
 */
module.exports = function(app) {
  
  var searchLocation = function(req,res) {
    console.log("routes/search.js in searchLocation");
    res.send([]); //empty array
  }
  
  var searchEvent = function(req,res) {
    console.log("routes/search.js in searchEvent");
    
    console.log(req.param);
    var lat =  parseFloat(req.param("lat"));
    var lng = parseFloat(req.param("lng"));
    
    var location = [lng, lat];
    console.log(location);    
    var locationFilter = {$near: location, $maxDistance: 1};
    
    
    var filter = {"loc" : locationFilter};
    
    
    
    app.events.find(filter, function(err, cursor) {
      if (err) { console.log(err); }
      
      cursor.toArray(function(err, items) {
        console.log("Found items");
        console.log(items);
        res.send(items);
      });
    });
    
    //res.send([{}]); //empty array
  }
  
  app.get('/search/loc', searchLocation);
  app.get('/search', searchEvent)
};