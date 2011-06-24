

var LOCAL_STORAGE_PREFIX = "eventington.cache.";
var SERVER_GEOCODE_URL = "geocode";
var SERVER_GEOCODE_URL_SEARCH = SERVER_GEOCODE_URL + "?l=";
var SERVER_EVENT_URL = "location";
var api_key_192_168_2_52_3005 = "ABQIAAAAxkDTksyhjiJTpVwyvJzXKRSTmNclSbpvz4vzw1ViJAIBBWYLKBSbuK433SpQXtEiZU4fO7wvJtEgMA";


//page elements identified with jquery.

//var results_list = $('#results-list');
//var map_canvas = $('#map_canvas');
//var loc_textbox = $('loc');







/*
* Function to return the browser location using by geocoding api.
*/
var getBrowserLocation = function() {
  log("attempting to lookup location");
  if (Modernizr.geolocation) {

      /*
      * Function to show the map based upon the geolocation api co-ordintates.
      */
      var onSuccess = function(position) {
        log("browser geolocation success");
        
        //1. try and lookup a name for this location and add it to the textbox
        getLocationNameFromCoords(position.coords.latitude, 
            position.coords.longitude, 
            function(results) {
              $('#loc').val(results[1].formatted_address);
            }, 
            function() {
              //onError
            }              
        );
        
        //2. display the map at the location specified
        loadMap(position.coords.latitude, position.coords.longitude);
      };
      
      /*
      * If there is an error, then display the relevant error messsage.
      */
      var onError = function() {
        showError("Sorry, could not determine your browsers location.  Please enter a Town or Postcode manually");
      };
 

      var options = {
          maximumAge: 120000,  //two mins old is ok.
          enableHighAccuracy: false //don't need to be highly accurate - we're searching for miles around, not streets away.
      };
      
 
      
      //do the geolocation lookup using html5 browser api.
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }
};




var loadMap = function(lat,lng, date, shouldDoSearch) {
  console.log("in loadMap");
  var latlng = new google.maps.LatLng(lat, lng);
  console.log("created latlng: " + latlng);
  var myOptions = {
    zoom: 8,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  console.log("created myoptions");
  
  

  var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
  console.log("shown map");
    
  var marker = new google.maps.Marker({
    position: latlng,
    title:"You are here"
  });
  
  // To add the marker to the map, call setMap();
  marker.setMap(map);  
  
  
  
  if (shouldDoSearch) {
    //if we should also dot he search (as well as loading the map), then 
    var mapDataLoadedCallback = function(data) {
      
      //todo: convert the data into javascvript event objects and add as markers.
      for (var i = 0; i < data.length; i++) {
        var event = data[i];
        
        latlng = new google.maps.LatLng(event.loc.lat, event.loc.long);
        marker = new google.maps.Marker(
          {position: latlng, title: event.name }
        );
        marker.setMap(map);
        
        $("#results").html($("#results").html() + "<li>" + event.name + "</li>");
        
      }
      
      
      
    };

  
    //Callback to the server using ajax and load some data to create new markers.
    searchforEvents(lat, lng, date, mapDataLoadedCallback);
  }
    
};



/*
* Function called by clicking the search button.
* Clicking this will load the location from the #location field, and attempt to geocode it.
* On successful geocode, it will load the google map, and position a marker on the center.
* Once the map is loaded, it will callback to the server to load some search data.
*/
var doSearch = function(location, date) {
  
  /* 
  * Callback function(data) { data.latitude, data.longitude }
  */
  var callbackFunction = function(data) {
    if(data !== null) {  
      console.log("loading map");
      loadMap(data.latitude, data.longitude, date, true);
    } else {  
      alert('ERROR! Unable to geocode address');  
    }
  };
  
  //perform the geocode lookup.  
  cachedGeocodeLookup(location, callbackFunction);
};




/*
* Searches for events around a location on a specific date.
* The callback function is called with the returned data.
*
* Callback function(data) { data.latitude, data.longitude }
*
*/  
var searchforEvents = function(lat, lng, startDate, callbackFunction) {
  log("startDate: ");
  log(startDate);
	
  ajaxGet("/locations?lat=" + lat + "&lng=" + lng + ", &s=" + startDate, "", callbackFunction);
  
};
