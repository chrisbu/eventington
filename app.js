
/**
 * Module dependencies.
 */

var express = require('express');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//DB Connection
var db = new Db('eventington', new Server("127.0.0.1", 27017, {}), {native_parser:true});


// Routes

require("./routes/default")(app);
require("./routes/location")(app);




// Only listen on $ node app.js



if (!module.parent) {
  db.open(function(err,db) {
    app.db = db;
    
    var startApp = function() {
      app.listen(3005);    
      console.log("DB Opened and Express server listening on port %d", app.address().port);  
    };
    
    var onEnsureDateIndex = function(err, indexName) {
      if (err) { console.log(err); }
      console.log(indexName);
      startApp();
    };
    
    var onEnsureLocationIndex = function(err, indexName) {
      if (err) { console.log(err); }
      console.log(indexName);
      app.events.ensureIndex({date: 1}, onEnsureDateIndex);        
    };
    
    var onGetEvents = function(err, collection) {
      app.events = collection;
      app.events.ensureIndex({loc: "2d"}, onEnsureLocationIndex);
    };
    
    app.db.collection('events', onGetEvents);
    
    /*app.db.collection('events', function(err, collection) {
      app.events = collection;
      collection.ensureIndex({loc : "2d"}, function(err, indexName) {
        console.log(err);
        console.log(indexName);
        startApp();
      });
      
    });*/
    
  });
  
}
