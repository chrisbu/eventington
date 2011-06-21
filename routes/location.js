//Route for /loclook

module.exports = function(app) {
  
  /*
  * Returns all the events from the DB as JSON.
  *
  */  
  var locationLookup = function(req, res) {
    
    //create the location filter.
    var lat =  parseFloat(req.param("lat"));
    var long = parseFloat(req.param("long"));
    
    var location = [long, lat];
    console.log(location);    
    var locationFilter = {$near: location, $maxDistance: 1};
    
    
    //create the dateFilter.
    var start = req.param("s"); //start date
    var end = req.param("e"); //end date -- may not exist.
 
 
 
    var dateFilter = {};
    
    if (end) { 
      //there is an end date, so assume a range.
      //var startDate = new Date("2011-06-15");
      var startDate = new Date(start);
      var endDate = new Date(end);
      dateFilter = {$gte: startDate, $lt: endDate};
    }
    else {
      //no end date, so assume a single date.
      var startDate = new Date(start);
      var endDate = new Date(start);
      console.log(endDate);
      dateFilter = {$gte: startDate, $lt: endDate};
      console.log(dateFilter);
    }
    
    
    
    
    //create the final filter.
    var filter = {
      "loc": locationFilter,
      "date": dateFilter
    };
    
    
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