/* Author: 

*/

$(document).ready(function() {   
  /* 
   io.setPath('/client/');
   socket = new io.Socket(null, { 
     port: 8081
     ,transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
   });
   socket.connect();
    
   $('#sender').bind('click', function() {
     socket.send("Message Sent on " + new Date());     
   });
   
   socket.on('message', function(data){
     $('#reciever').append('<li>' + data + '</li>');  
   });
      */
});


var GoogleGeocode = function(apiKey) {  
    this.apiKey = apiKey;  
    this.geocode = function(address, callbackFunction) {  
        jQuery.ajax({  
            dataType: 'jsonp',  
            url: 'http://maps.google.com/maps/geo?output=json&oe=utf8&sensor=false'  
                    + '&key=' + this.apiKey + '&q=' + address,  
            cache: false,  
            success: function(data){  
                if(data.Status.code==200) { 
                   var result = {};  
                    result.longitude = data.Placemark[0].Point.coordinates[0];  
                    result.latitude = data.Placemark[0].Point.coordinates[1];  
                    callbackFunction(result);  
                } else {  
                    callbackFunction(null);  
                }  
            }  
          });  
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

    //todo: Callback to the server using ajax and load some data to create new markers.
    
};

var doSearch = function() {
   var g = new GoogleGeocode("");  
    var address = $('#location').val();  
    g.geocode(address, function(data) {  
    if(data !== null) {  
       // alert("Street Address: " + data.longitude + " " + data.latitude);  
       console.log("loading map");
       loadMap(data.latitude, data.longitude);
    } else {  
        alert('ERROR! Unable to geocode address');  
    }  
});  
};

