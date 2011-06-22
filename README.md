EVENTINGTON
===========

what - where- when
------------------

*Version 0 - very much pre-alpha.*



Eventington is a node.js + mongodb event finder.

Simply put, it allows end users to find what's happening where and 
when by doing a search around a location on a specific date.

At present, it's simply a proof of concept that I've created to see if I can 
do this using technologies new to myself.



Technology
----------

Under the covers, it uses node.js with express and mongodb (with geospatial index) on the server side, 
javascript + html5 on the client side using boilerplatehtml template.
It makes use of Google mapping api's to provide geolocation and mapping.

Changelog
---------

7th June 2011
*Version 0*
Currently you can 
* 1. add an event record 
* 2. search around a location to see event records that have been stored nearby on a specific date