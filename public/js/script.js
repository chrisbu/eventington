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










$(document).ready(function() {   
    $("input").labelify(); 
    $("button, input:submit, a").button();
    $("#dat").datepicker({ dateFormat: 'yy-mm-dd' });
  
  
    $('a[href=#target]').click(function(){
        var target = $('a[name=target]');
        if (target.length)
        {
            var top = target.offset().top;
            $('html,body').animate({scrollTop: top}, 1000);
            return false;
        }
    });
  
  console.log("script ready");
 // getBrowserLocation();
  
  if ($('#date')) {
    log("datepicker");
    $('#date').datepicker({ dateFormat: 'yy/mm/dd' });
  }
  
  $('#logo-text').plaxify({"xRange":10,"yRange":7});
  $('#logo-tag').plaxify({"xRange":4,"yRange":4,"invert":false});
  /*$('#logo-sun').plaxify({"xRange":7,"yRange":5,"invert":true});
  $('#logo-back').plaxify({"xRange":3,"yRange":3,"invert":true});*/
  $.plax.enable();
  
  
});