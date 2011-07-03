Backlog
=======

Required Functionality
----------------------
-  geocode - Convert a name into a lat / lng
  1. enter town or postcode
  2. check client side cache for lat lng
  3. check server for lat lng
    - GET: /geo/code?name=xxx
  4. check google for lat lng
    1. cache google result client side
    2. cache google result server side
      - POST: /geo/code
        - json data: {name: XXX, lat: nn.nnn, lng: mm.mmm}
  5. Have lat lng for the entered location string.
- reverse geocode - Convert a lat / lng into a name
  1. convert lat lng to geohash
  2. check client side cache for geohash
  3. check server side cache for geohash
    - GET: /geo/rev?hash=XXX
  4. check google for lat + lng
    1. cache google result for lat lng converted to geohash
      1. in local client
      2. on server
        - POST: /geo/rev
          - json data: {hash: XXX, name: YYY}
  5. Have name which represents lat lng + geohash.  
- geolocate - Automatically determine whereabouts the browser is using browser api's.
  1. use modernizr if available
    1. use reverse geocode to get name for lat lng
    2. display name in "Location" box.
- date entry 
  1. implement datejs to allow entering in text strings which are converted to dates
- search
  1. show search results on list
    1. GET: /search?s=2011-01-23&e=2011-01-25&lat=nn.nnn&lng=yy.yyy    
    2. Available fields:
      - date 
      - time 
      - location full name
      - short description 
      - link to more...
      - link to directions...
      - possible image     
    3. tweet search result
    4. fb search result 
    5. +1 search result
    6. when search result clicked
      1. it pops up infobox on map
      2. result is highlited
    7. Add to my favorites
  2. show search results on map
    1. center map on current location
    2. show markers on map
      1. when marker clicked, 
        1. show infobox, which displays available fields         
        2. highlight result in results list
- add events
  1. allow adding events anonymously.
    1. save event with following data
      POST: /events
        json data: {date: "2011-01-23", time: "22:13:05", qloc: "Chris's House", loc: "123 The Street, Someplace, Some County, ABC123, UK", lat: "12.345", lng: "23.456", "Party at chris's house", dur: "06:00:00" }   
      - date
      - time
      - duration
      - location quick name
        1. allow autocomplete - it may already exist.
          - GET: /search/loc?n=Chr
            - return json array: ["Chris's House", "Christmas Town", "Chris's Place"]
      - location full name
        1. reverse geocode to get lat lng for location
      - short description
- session handling
  1. Remember users location from cookie
  2. Remember users favorites from local storage.
  3. Remember previous searches from local storage.
- user registration
  1. Allow user to sign in with open id / google id etc... 
    1. if user signs up, copy the local storage data to server side storage
- user sign in
  1. When user signs in, merge local storage and server storage data.

   





   

  
 





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