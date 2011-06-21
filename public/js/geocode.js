/*

GEOCODE LIBRARY FUNCTIONS

*/



/*
*  Function to get the name from the lat long passed in.
* The callback function takes the results object back from the google lookup.
* 
*/
var getLocationNameFromCoords = function(lat, lng, onSuccess, onError) {
  
   log("getLocationNameFromCoords");
  
    var latlng = new google.maps.LatLng(lat, lng);
    
    var onComplete = function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        onSuccess(results);
        
      } 
      else {
        onError(status);
        /* Don't need to display an error because we've sucessfully located
        * the users location, but we've not been able to work out a
        * name for that location.  Normally, we'd display that name in the "Where"
        * text box, but in this case, we don't know.
        * The user can still make use of the application.
        */
        
      }
    };
    
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng':latlng}, onComplete);
  
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
    var onGoogleApiResult = function(result, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log("Found from google");
        var data = {};
        log(result);
        data.longitude = result[0].geometry.location.Ia;
        data.latitude = result[0].geometry.location.Ha
        data.cache_source = SOURCE_GOOGLE;
        
        
        onSuccess(data);
      }
      else {
        //todo: some kind of error handling.
      }
    };
    
    //perform the search
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode({'address':location}, onGoogleApiResult);
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