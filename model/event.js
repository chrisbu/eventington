var Location = require("./location.js").Location;

var Event = function(location, datetime, shortDescription) {
  this.location = location;
  this.date = datetime;
  this.shortDesc = shortDescription;
  this.durMins = 0;
};


module.exports.Event = Event;
