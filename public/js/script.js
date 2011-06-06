/* Author: 
  Chris Buckett
*/



var LOCAL_STORAGE_PREFIX = "eventington.cache.";
var SERVER_GEOCODE_URL = "geocode";
var SERVER_GEOCODE_URL_SEARCH = SERVER_GEOCODE_URL + "?l=";
var SERVER_EVENT_URL = "location";


var api_key_192_168_2_52_3005 = "ABQIAAAAxkDTksyhjiJTpVwyvJzXKRSTmNclSbpvz4vzw1ViJAIBBWYLKBSbuK433SpQXtEiZU4fO7wvJtEgMA";
var dataCache = {};

/*
* Cache calls to to any server url/
*
* Parameters: 
* serverUrl - this is the cache key
* dataType - "" or "json-p"
* callback - callback function (resultData, fromCache=true/false) which gets executed when request completes
*/
var ajaxGet = function(serverUrl, dataType, callback) { //callback(resultData, fromCache=true/false)
  console.log("in ajaxGet=" + serverUrl);
 // if (dataCache[serverUrl] !== undefined) {
//    console.log("getting from cache");
//    var resultData = dataCache[serverUrl];
//    callback(resultData, true); //callback 
//  }
//  else {
    console.log("getting live data");
    $.ajax({
      dataType: dataType,
      url: serverUrl,
      cache: false,
      success: function(data) {
        console.log("success");
        console.log(data);
        dataCache[serverUrl] = data;
        callback(data, false);
      },
      
      error: function(data) {
        console.log("error");
        console.log(data);
        alert("Error");
        callback(data,false);
      }
      
    });
  //}
};


/*
* Performs a geocode lookup, first looking up data in the following order
* 1. Local browser memory cache
* 2. Local browser HTML5 db
* 3. Server side db
* 4. Google geocode lookup
*
*
* Callback function(data) { data.latitude, data.longitude }
*
*/
var cachedGeocodeLookup = function(location, callback) {
  
  var SOURCE_MEMORY = "Memory";
  var SOURCE_LOCAL = "Local";
  var SOURCE_SERVER = "Server";
  var SOURCE_GOOGLE = "Google";
  
  /*
  * Called when successfully geocoded.  
  * We add the data to in memory storage and browser local storage 
  *  (if available) (to persist across sessions).
  * Persist to the server
  * 
  */
  var onSuccess = function(data) {
    console.log(data);
             
    var dataAsString = JSON.stringify(data);
    
    //save the cached data if req'd.
    if (data.cache_source === SOURCE_MEMORY) {
      //do nothing, we must have retrieved it from somewhere else already for it to be in local memory.
    }
    else if (data.cache_source === SOURCE_LOCAL) {
      //add to the local memory cache as we would have retrieved it from somewhere server side originally.
      dataCache[location] = data;
    }
    else if (data.cache_source === SOURCE_SERVER) {
      //add to the local cache and local memory.
      dataCache[location] = data; //local memory
      if (Modernizr.localstorage) {
        //local storage
        console.log("Adding: " + dataAsString);
        
        localStorage[LOCAL_STORAGE_PREFIX + location] = dataAsString;
      }
    }
    else if (data.cache_source === SOURCE_GOOGLE) {
      //add to local cache, local memory and server cache.
      dataCache[location] = data; //local memory
      if (Modernizr.localstorage) {
        //local storage
        console.log("Adding: " + dataAsString);
        
        localStorage[LOCAL_STORAGE_PREFIX + location] = dataAsString;
        
      }
      
      //server side cache.
      $.post(SERVER_GEOCODE_URL, data);
        
    }
      
    //Call the callback.
    callback(data);
    
  };
  
  
  /*
  * Returns the data from the dataCache.  May return undefined.
  */ 
  var getFromLocalMemoryCache = function() {    
    console.log("Trying local memory cache");
    var resultData = dataCache[location];
    if (resultData) {
      resultData.cache_source = SOURCE_MEMORY;
    }
    return resultData;    
  };
  
  /*
  * Returns the cached data if in local storage.
  */
  var getFromBrowserLocalStorage = function() {
    console.log("Trying browser local storage");
    if (Modernizr.localstorage) {
      var cachedData = localStorage[LOCAL_STORAGE_PREFIX + location];

      var resultData;
      
      if (cachedData) {
        resultData = JSON.parse(cachedData);      
      }
      else {
        return false;
      }
      
      if (resultData && resultData.longitude && resultData.latitude) {
        resultData.cache_source = SOURCE_LOCAL;
      }
      else {
        console.log("Local storage available but not found in local storage.");
      }
      
      return resultData;      
    }
    else {
      console.log("Local storage not available");
      return false;
    }
  };
  
  
  /*
  * if successful, calls the callback function.
  * if not successful, calls the googleApiFallbackFunction
  */
  var getFromServerSide = function(googleApiFallbackFunction) {
    console.log("Trying server side storage");
    var serverUrl = SERVER_GEOCODE_URL_SEARCH + location;
    
    $.ajax({
      url: serverUrl,
      cache: false,
      success: function(data) {
        //got the data from the server
        //send the data to the callback.
        console.log("Found in server cache");
        data.cache_source = SOURCE_SERVER;
        onSuccess(data);
      },
      
      error: function(data) {
        //didn't get the data from the server,
        //try google api instead.
        googleApiFallbackFunction();
      }
      
    });
  };
  
  /*
  * Try and get the data from the google api.
  */
  var getFromGoogleApi = function() {
    console.log("Trying google api");
    
    /*
    * If successful, call the success callback function.
    */
    var onGoogleApiResult = function(data) {
      if(data) {  
        console.log("Found from google");
        data.cache_source = SOURCE_GOOGLE;
        onSuccess(data);
      }
      else {
        //todo: some kind of error handling.
      }
    };
    
    //perform the search
    var g = new GoogleGeocode(api_key_192_168_2_52_3005);
    g.geocode(location, onGoogleApiResult);
  };
  
  
  
  
  // 1. Try from local memory cache.
  var resultData = getFromLocalMemoryCache();
  if (resultData && resultData.longitude && resultData.latitude) {
    console.log("Found in local memory cache");
    onSuccess(resultData);
  }  
  else {
    
    // 2. Try from local storage.
    resultData = getFromBrowserLocalStorage();
    console.log(resultData);
    if (resultData && resultData.longitude && resultData.latitude) {
      console.log("Found in local storage cache");
      onSuccess(resultData);
    }
    else {
      
      //3. Try from server cache,  and
      //4. Fallback to google api if it fails.
      getFromServerSide(getFromGoogleApi);
    }
  }
    
  
  
  
};



/*
* Function Object (created with new) to allow looking up a lat lng from a location.
* Usage: 
    g = new CachedGeocode(apiKey)
    g.geocode("London", function(result));
      
* Results are cached on the client to reduce the number of lookups required.
*
*/
var CachedGeocode = function(apiKey) {
  this.apiKey = apiKey;
  
  this.geocode = function(location, callbackFunction) {
    var onComplete = function(data, fromCache) {
      if(data.Status.code==200) { 
        var result = {};  
        result.longitude = data.Placemark[0].Point.coordinates[0];  
        result.latitude = data.Placemark[0].Point.coordinates[1];  
        callbackFunction(result);  
      } else {  
        callbackFunction(null);  
      }
    };
    
    var url =  'http://maps.google.com/maps/geo?output=json&oe=utf8&sensor=false' + '&key=' + this.apiKey + '&q=' + location;
    ajaxGet(url, 'jsonp', onComplete);
  };
};


/*
* Function Object (created with new) to allow looking up a loa
*
*/
var GoogleGeocode = function(apiKey) {  
  this.apiKey = apiKey;  
  this.geocode = function(address, callbackFunction) {  
    jQuery.ajax({  
      dataType: 'jsonp',  
      url: 'http://maps.google.com/maps/geo?output=json&oe=utf8&sensor=false' + '&key=' + this.apiKey + '&q=' + address,  
      cache: false,  
      success: function(data){  
        if(data.Status.code==200) { 
          var result = {};  
          result.longitude = data.Placemark[0].Point.coordinates[0];  
          result.latitude = data.Placemark[0].Point.coordinates[1];  
          callbackFunction(result);  
        } else {  
          callbackFunction(null);  
        }  //if        
      } // success function  
    }); //ajax  
  };  
};

var loadMap = function(lat,lng) {
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
  searchforEvents(lat, lng, new Date(), mapDataLoadedCallback);
    
};

/*
* Searches for events around a location on a specific date.
* The callback function is called with the returned data.
*
* Callback function(data) { data.latitude, data.longitude }
*
*/
var searchforEvents = function(lat, lng, date, callbackFunction) {
  
  ajaxGet("/locations?lat=" + lat + "&long=" + lng + ", &date=" + date, "", callbackFunction);
  
};

/*
* Function called by clicking the search button.
* Clicking this will load the location from the #location field, and attempt to geocode it.
* On successful geocode, it will load the google map, and position a marker on the center.
* Once the map is loaded, it will callback to the server to load some search data.
*/
var doSearch = function(location) {
  
  /* 
  * Callback function(data) { data.latitude, data.longitude }
  */
  var callbackFunction = function(data) {
    if(data !== null) {  
      console.log("loading map");
      loadMap(data.latitude, data.longitude);
    } else {  
      alert('ERROR! Unable to geocode address');  
    }
  };
  
  //perform the geocode lookup.  
  cachedGeocodeLookup(location, callbackFunction);
};


/*
* Function to geocode a location into a lat lng and a name, for adding a location to the server.
*
*
*/
var saveEvent = function(location, event ) {
    
  /* 
  * Callback function(data) { data.latitude, data.longitude }
  */
  var callbackFunction = function(data) {
    if(data !== null) {  
      console.log("geocode ok");
      var event = {
        "lat" : data.latitude,
        "lng" : data.longitude,
        "name" : location,
        "event" : eventType
        
      }
        
      $.post(SERVER_EVENT_URL, event);      
    } else {  
      alert('ERROR! Unable to geocode address');  
    }
  };
  
  //perform the geocode lookup.  
  cachedGeocodeLookup(location, callbackFunction);
};


var getBrowserLocation = function() {
  console.log($('#locateMe').length);
  
  if ($("#locateMe").length) {
    if (Modernizr.geolocation) {
      console.log("has geolocation");
      
      var showMap = function(position) {
        console.log("showin map from geolocation");
        console.log(position);
        loadMap(position.coords.latitude, position.coords.longitude);
      };
      
      var options = {
        maximumAge: 120000,
        enableHighAccuracy: false
      };
      
      //getCurrentPosition(success, error, options)
      navigator.geolocation.getCurrentPosition(showMap, function() {}, options);
      
    }
  }
};





$(document).ready(function() {   
  console.log("script ready");
  getBrowserLocation();
});