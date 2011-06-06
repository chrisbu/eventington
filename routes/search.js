
module.exports = function(app) {
  
  var search = function(req, res) {
    
    
    var results = [
      { 
        lat: 51.1156, 
        lng: 0.4593,
        name: "Goudhurst"
      },
      { 
        lat: 51.1397, 
        lng: 0.4290,
        name: "Horsmonden"
      }
    ];
    
    
        //todo: lookup events from the database and return.
        //on the front end, we then need to convert the return values into markers.
    res.send(results);
  };
  
  app.get('/search', search);
  
  
    
};