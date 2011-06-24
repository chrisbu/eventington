
/*
* Function to geocode a location into a lat lng and a name, for adding a location to the server.
*
*
*/
var saveEvent = function(location, eventName, date) {
    
  /* 
  * Callback function(data) { data.latitude, data.longitude }
  */
  var callbackFunction = function(data) {
    if(data !== null) {  
      console.log("geocode ok");
      
      date = date + " 00:00:00.000Z";
      
      var event = {
        "lat" : data.latitude,
        "lng" : data.longitude,
        "name" : location,
        "event" : eventName,
        "date" : date        
      };
        
      log(event);
      $.post(SERVER_EVENT_URL, event);      
    } else {  
      alert('ERROR! Unable to geocode address');  
    }
  };
  
  //perform the geocode lookup.  
  cachedGeocodeLookup(location, callbackFunction);
};
