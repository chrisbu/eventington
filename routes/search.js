/*
 * Provided for search functionality
 */
module.exports = function(app) {
  
  var searchLocation = function(req,res) {
    console.log("routes\search.js in searchLocation");
    res.send([]); //empty array
  }
  
  var searchEvent = function(req,res) {
    console.log("routes\search.js in searchEvent");
    res.send([{}]); //empty array
  }
  
  app.get('/search/loc', searchLocation);
  app.get('/search', searchEvent)
};