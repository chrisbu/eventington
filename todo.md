Backlog
=======

Required Functionality
----------------------
-  geocode - Convert a name into a lat / lng
  1. enter town or postcode
  2. check client side cache for lat lng
  3. check server for lat lng
  4. check google for lat lng
    1. cache google result client side
    2. cache google result server side
  5. Have lat lng for the entered location string.
- reverse geocode - Convert a lat / lng into a name
  1. convert lat lng to geohash
  2. check client side cache for geohash
  3. check server side cache for geohash
  4. check google for lat + lng
    1. cache google result for lat lng converted to geohash
      1. in local client
      2. on server
  5. Have name which represents lat lng + geohash.
  
- geolocate - Automatically determine whereabouts the browser is using browser api's.
  1. use modernizr if available
    1. use reverse geocode to get name for lat lng
    2. display name in "Location" box.

-  

 





Infrastructure type stuff
--------------------------
-  add a proper logging framework on the server side
-  add a proper logging framework on the client side
-  add client side namespacing
-  define the functions of the application and do some proper documentation


Usability type stuff
---------------------
-  allow users to login
-  add sessions  