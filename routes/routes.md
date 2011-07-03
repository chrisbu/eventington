Geocode - get name to lat + lng
  GET: /geo?name=xxx
    - return location record: { lat: xx.xxx, lng: yy.yyy, name: xxx}

Save name with lat + lng  
  POST: /geo
    - json data: {name: XXX, lat: nn.nnn, lng: mm.mmm}

Reverse geocode - Convert lat lng to name
  GET: /geo?lat=xx.xxx&lng=yy.yyy
    - return location record: { lat: xx.xxx, lng: yy.yyy, name: xxx}

Search for location names for autocompletion
  GET: /search/loc?n=Chr
    - return json array: ["Chris's House", "Christmas Town", "Chris's Place"]

Search for event on date:
  GET: /search?s=2011-01-23&lat=nn.nnn&lng=yy.yyy
    - return array of events: [{date: "2011-01-23", time: "22:13:05", location: {name: "123 The Street, Someplace, Some County, ABC123, UK", lat: "12.345", lng: "23.456"}, shortDesc: "Party at chris's house", durMins: 180 }, {etc...}]

Search for event in date range:
  GET: /search?s=2011-01-23&e=2011-01-25&lat=nn.nnn&lng=yy.yyy
    - return array of events: [{date: "2011-01-23", time: "22:13:05", location: {name: "123 The Street, Someplace, Some County, ABC123, UK", lat: "12.345", lng: "23.456"}, shortDesc: "Party at chris's house", durMins: 180 }, {etc...}]

Add new event:
  POST: /event
    - json data: {date: "2011-01-23", time: "22:13:05", location: {name: "123 The Street, Someplace, Some County, ABC123, UK", lat: "12.345", lng: "23.456"}, shortDesc: "Party at chris's house", durMins: 180 }

