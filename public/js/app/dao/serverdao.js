/*
 * Eventington javascript ui dao layer - provides ui - server data access via REST
 * 
 * Public Functions:
 *  (NOTE: All functions take err(data) function callback as their first parameter )
 * 
 *  getCoordFromName(err, name="name")
 *  - GET: /geo?name=xxx
 *  - convert coord into name
 * 
 * 
 *  getNameFromCoord(err, lat=xx.xxx, lng=yy.yyy)
 *  - GET: /geo?lat=xx.xxx&lng=yy.yyy
 *  - convert name into coord  
 * 
 * POST: /geo
 *  - save name + lat lng to server
 *   
 * GET: /search/loc?n=Chr
 *  - search for location names (for autocomplete boxes)
 * 
 * GET: /search?s=2011-01-23&lat=nn.nnn&lng=yy.yyy
 *  - search for events on a specific date around a location
 * 
 * GET: /search?s=2011-01-23&e=2011-01-25&lat=nn.nnn&lng=yy.yyy
 *  - search for events within a date range around a location
 *  
 * POST: /event
 *  - add a new event.
 *  
 */

/*
 * Namespace the methods, using the technique described here:
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ 
 */
(function(eventington, $, undefined) {
  
  /*
   * Create the dao namespace within eventington.
   */
  (function(serverdao, $, undefined) {
    
    /*
     * Looks up to the server to convert a name into a single unique lat lng values.
     * - GET: /geo?name=xxx
     * returns a location object.
     * 
     * If no single location matches, then it will call the error handler.
     * 
     * @param err
     *   Function callback err(data) which is called on error, of if there is no single location found. 
     * @param success
     *   Function callback ret(data) which is called on success.
     *   Location object, eg:
     *  { name: "my place", 
     *    lat: xx.xxx, 
     *    lng: yy.yyy  }
     * @param name
     *   The name to get the best matching coordinate for.
     */
    serverdao.getCoordFromName = function(err, success, name) {
      
      //use jquery to perform the get.
      var url = "/geo";
      var data = {"name": name};
      
      /*
       * Callback function 
       */
      var onSuccess = function(data) {
        if ($.isEmptyObject(data)) {
          err("No Data Found");
        } 
        else {
          success(data);
        }
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.get(
        url,
        data,
        onSuccess        
      ).error(onError);
      
      return true;
    
    };
    
    /*
     * Looks up to the server to convert lat lng into a name.
     * - GET: /geo?lat=xx.xxx&lng=yy.yyy
     * returns a location object
     *  { name: "my place", 
     *    lat: xx.xxx, 
     *    lng: yy.yyy  }
     * 
     *  If the name can't be looked up, then it will call the error handler.
     * 
     * @param err
     *   Function callback err(data)
     * @param success
     *   Function callback success(data)
     *   a location object, eg:
     *  { name: "my place", 
     *    lat: xx.xxx, 
     *    lng: yy.yyy  }
     * @param lat 
     *   Latitude value
     * @param lng
     *   Longitude value
     *  
     */
    serverdao.getNameFromCoord = function(err, success, lat, lng) {
      //use jquery to perform the get.
      var url = "/geo";
      var data = {"lat": lat, "lng" : lng};
      
      var onSuccess = function(data) {
        if ($.isEmptyObject(data)) {
          err("No Data Found");
        } 
        else {
          success(data);
        }
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.get(
        url,
        data,
        onSuccess        
      ).error(onError);
      
      return true;
      
    };
    
    /*
     * Passes a location object to the server for saving (or updating if it already exists)
     * - POST: /geo
     *  Posts the following json to the server:
     * {
     *    name: "my place", 
     *    lat: xx.xxx, 
     *    lng: yy.yyy
     *  }
     * 
     * The logic used on the server is that the lat + lng value is the primary key.  
     * If the lat + lng exists, but the name is different, then this will replace the name on the server
     * If the lat + lng doesn't exist, it will add this name, even if the name exists already.
     * 
     * @param err
     *   Function callback err(data)
     * @param success
     *   Function callback success(data)
     * @param success
     * @param location
     *   location object in the form of json: {name, lat, lng}
     */
    serverdao.saveLocation = function(err, success, location) {
      
      //use jquery to perform the get.
      var url = "/geo";
      var data = location;
      
      var onSuccess = function(data) {
        if (data === true) {
          success("OK");
        }
        else {
          err("NOK");
        }
        
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.post(
        url,
        data,
        onSuccess        
      ).error(onError);
      
      return true;
      
    };
    
    
    /*
     * Searches for locations that *contain* the location string (case insensitive).
     * This is provided for autocomplete boxes where the user can type a location.
     * 
     * - GET: /search/loc?n=locationString 
     * where Chr is the location string.
     * 
     * Will return an array of location objects, including an empty array if nothing matches.
     * 
     * @param err
     *   Function callback err(data)
     * @param success
     *   Function callback success(data)
     *   - contains an array of 0..* location objects.
     * @param locationString
     *   The location string to serach for.
     *  
     */
    serverdao.searchLocation = function(err, success, locationString) {
      //use jquery to perform the get.
      var url = "/search/loc";
      var data = {"locName": locationString};
      
      var onSuccess = function(data) {
        success(data);
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.get(
        url,
        data,
        onSuccess        
      ).error(onError);
      
      return true;      
    };
    
    /*
     * Searches around a location for events on a specific date, or in a date range if the end date is specified.
     *
     * GET: /search?s=2011-01-23&lat=nn.nnn&lng=yy.yyy  
     * GET: /search?s=2011-01-23&e=2011-01-25&lat=nn.nnn&lng=yy.yyy
     * 
     * 
     * @param err
     *   Function callback err(data) 
     * @param success
     *   Function callback success(data)
     *   - contains an array 1..* of event objects
     * @param location
     *   location containing lat + lng to search around. 
     * @param startDate
     *   start date to search on.   
     * @param endDate 
     *   [optional] end date to search on.  If not supplied, then searces for events only on the start date, otherwise
     *    searches for events within in an inclusive date range.
     */
    serverdao.searchEvents = function(err, success, location, startDate, endDate) {
      var url = "/search";
      
      var searchCriteria = {};
      searchCriteria.lat = location.lat;
      searchCriteria.lng = location.lng;
      searchCriteria.s = startDate;
      if (endDate !== undefined) {
        //optional parameter.
        searchCriteria.e = endDate;
      }
      
      
      var onSuccess = function(data) {
        if ($.isEmptyObject(data)) {
          err("No Data Found");
        } 
        else {
          success(data);
        }
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.get(
        url,
        searchCriteria,
        onSuccess        
      ).error(onError);
      
      return true;      
      
      
      
    };
    
    /*
     * Provides a method for a user to save an event.
     * 
     * POST: /event
     * 
     * @param err
     *   Function callback err(data)
     * @param success
     *   Function callback success(data)     
     * @param eventRecord 
     *   Event record
     *  POST Data: {
     *   date: "2011-01-23", 
     *   time: "22:13:05", 
     *   location: {name: "123 The Street, Someplace, Some County, ABC123, UK", lat: "12.345", lng: "23.456"}, 
     *   title: "Party at chris's house", 
     *   durMins: 180 
     * } 
     *   
     */
    serverdao.saveEvent = function(err, success, eventRecord) {
      log("serverdao.saveEvent");
      
      //use jquery to perform the get.
      var url = "/event";
      var data = eventRecord;
      
      var onSuccess = function(data) {
        if (data === true) {
          success("OK");
        }
        else {
          err("NOK");
        }
        
      };
      
      var onError = function(data) {
        err(data.status);
      };
      
      
      // perform the server call.
      $.post(
        url,
        data,
        onSuccess        
      ).error(onError);
      
      return true;
    };
    
    
  }(eventington.serverdao = eventington.serverdao || {}, $)); //self executing anonymous functon to create the namespace methods
  
}(window.eventington = window.eventington || {}, jQuery)); //self executing anonymous functon to create the namespace methods

