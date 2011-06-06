//Route for /loclook

module.exports = function(app) {
  
  /*
  * Returns all the events from the DB as JSON.
  *
  */  
  var locationLookup = function(req, res) {
    //todo: lookup the location out of mongodb.
    var lat =  parseFloat(req.param("lat"));
    var long = parseFloat(req.param("long"));
    var location = [long, lat];
    console.log(location);
    
    app.events.find({"loc": {$near: location, $maxDistance: 1}}, function(err, cursor) {
      if (err) { console.log(err);}
      
      cursor.toArray(function(err, items) {          
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
      name: req.body.name
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