//Route for /

module.exports = function(app) {
  
  var getDateString = function(date) {
  	var dateString = "" + date.getUTCFullYear() + "-" + (date.getUTCMonth() +1) + "-" + date.getUTCDate();
  	console.log("got date string: " + dateString);
  	return dateString;
  };
  
  /*
   * Returns a date on the specific date at 00:00:00.000 (the very start of the day)
   */
  var getStartDate = function(dateString) {
  	console.log("startDate: " + dateString);
  	var startDate = new Date(dateString + " 00:00:00.000");
  	return startDate; 
  };
  
  /*
   * Returns a date on the specific date at 23:59:59.999 (the very end of the day).
   */
  var getEndDate = function(dateString) {
  	console.log("endDate: " + dateString);
  	var endDate = new Date(dateString + " 23:59:59.999");
  	return endDate;
  };
  
  
  /*
  * Returns all the events from the DB as JSON.
  *
  */  
  var locationLookup = function(req, res) {
    
    //create the location filter.
    var lat =  parseFloat(req.param("lat"));
    var lng = parseFloat(req.param("lng"));
    
    var location = [lng, lat];
    console.log(location);    
    var locationFilter = {$near: location, $maxDistance: 1};
    
    
    //create the dateFilter.
    var start = req.param("s"); //start date
    var end = req.param("e"); //end date -- may not exist.
 
 
 
    var dateFilter = {};
    
    if (start) {
	    if (end) { 
	      //there is an end date, so assume a range.
	      //var startDate = new Date("2011-06-15");
	      var startDate = getStartDate(start);
	      var endDate = getEndDate(end);
	      dateFilter = {$gte: startDate, $lt: endDate};
	    }
	    else {
	      //no end date, so assume a single date.
	      var startDate = getStartDate(start);
	      var endDate = getEndDate(start);
	      console.log(endDate);
	      dateFilter = {$gte: startDate, $lt: endDate};
	      console.log(dateFilter);
	    }
	}
	else {
		//no start date
		console.log("No start date entered");
		
		var today = getDateString(new Date()); //today
		console.log("today: " + today);
		var startDate = new Date(today + " 00:00:00.000");
		var endDate = new Date(today + " 23:59:59.999");
	    dateFilter = {$gte: startDate, $lt: endDate};
	}
    
    
    
    
    //create the final filter.
    var filter = {
      "loc": locationFilter,
      "date": dateFilter
    };
    
    console.log(filter);
    
    //perform the search.
    app.events.find(filter, function(err, cursor) {
      if (err) { console.log(err);}
      
      cursor.toArray(function(err, items) {          
        //callback when we get the items.  Just return them as json.
        console.log(items);
        res.send(items);            
      });
        
    });
   
  
  };
  
  
  /*
  * Add a location to the database.
  * render the "add location ui."
  *
  */
  var addLocation = function(req, res) {
    //todo: add the location to mongodb collection.
    console.log("in AddLocation");
   
    
    //create the event object
    var event = {
      loc: {         
        long : parseFloat(req.body.lng),
        lat: parseFloat(req.body.lat)
      },
      name: req.body.name,
      event: req.body.event,
      date: new Date(req.body.date)
    };
    
    console.log(event);
    
    app.db.collection('events', function(err, collection) {      
      //insert the evvent.
      collection.insert(event);
      res.render('location', { title: 'Add Location', flash: 'Added ok'} );
    });
    
  };
  
  
  /*
  * Render the Add Location ui.  
  */
  var editLocation = function(req, res) {
    res.render('location', { title: 'Add Location', flash: ''} );    
  };
  
  
  //Add the routes
  app.get('/locations', locationLookup);
  app.post('/location', addLocation);
  app.get('/location', editLocation); 
  
};