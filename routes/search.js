/*
 * Provides routes for /search functionality.
 * 
 * This provides the following functions
 * 
 * GET: /search/event
 *   - Search for events around a location on a specific date, or within a date range
 * 
 * GET: /search/location
 *   - Search for previously registered locations irrespective of date, optionally around another location.
 * 
 */




module.exports = function(app) {

  var pointModule = require("../model/point")(app);

  /*
   * GET: /search/event
   * 
   * This allows a user to do a GET /searchEvents passing the following parameters on the query string:
   * 
   * lat	Latitude in nn.nnnnnnnnn format
   * lng  Longitude in nn.nnnnnnnnn format
   * s	Inclusive start date of date range to search.  
   * 			Format: yyyy-mm-dd - this will be converted to yyyy-mm-dd 00:00:00.000
   * e	[Optional] end date of the date range to search.  
   * 			Format: yyyy-mm-dd - this will be converted to yyyy-mm-dd 23:59:59.999
   * 			If not specified, then the start date will be used.  This allows searching on a single day.
   * 
   * 
   * examples: 
   *	/search/event?lat=51.13254&lng=-0.157324&s=2011-06-23&e=2011-07-01
   * 		- this would search for events around a point, happening between the start of 26th June 2011, and the end of July 1st, 2011
   *   
   * 	/search/event?lat=51.13254&lng=-0.157324&s=2011-06-23
   * 		- this would search for events around a point, happening between the start of 26th June 2011, and the end of 26th June 2011
   */
  var searchEvent = function(req, res) {
    console.log(pointModule);
    
    //extract the parameters    
    var lat =  parseFloat(req.param("lat"));
    var lng = parseFloat(req.param("lng"));

    var point = pointModule.createPoint(lat,lng);
    
    var err = function(errString) {
      console.log(errString);
    };
    
    point.reverseGeocode(err, function() {});
    
  };
  
  

  app.get('/search/event', searchEvent);

};
