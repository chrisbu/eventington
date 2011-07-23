
/**
 * Module dependencies.
 */

var express = require('express');  //express middleware library
var Db = require('mongodb').Db; //mongodb database
var Server = require('mongodb').Server; //mongodb Server
// var everyauth = require('everyauth');
var util = require('util');

/* Everyauth configuration */
// everyauth.password
	// .getLoginPath("/login")
	// .postLoginPath("/login")
	// .loginView("login.ejs")
	// .authenticate( function(login, password) {
		// //TODO
		// return ['Login Failed'];
	// })
	// .loginSuccessRedirect("/")
	// .getRegisterPath("/register")
	// .postRegisterPath("/register")
	// .registerView("register.ejs")
	// .validateRegistration( function(newUserAttributes) {
		// //TODO
	// })
	// .registerUser( function(newUserAttributes) {
		// //TODO
	// })
	// .registerSuccessRedirect("/");


/* Create the server */
var app = module.exports = express.createServer(	
  express.cookieParser(),
  express.methodOverride(),
  express.bodyParser(),
  express.session({ secret: "fkgjhek vk4r34SR$Fsc" })
  // everyauth.middleware()
); //create the http server for this application


// Server Configuration
app.configure(function(){
  
  //view engine is ejs
  app.set('views', __dirname + '/views');  
  app.set('view engine', 'ejs');

  //allow useful routing
  app.use(app.router);
  
  //add a logging framework
  app.use(express.logger());
  

  
  //specify the static route.
  app.use(express.static(__dirname + '/public'));
  
});




// Specific configuration for development
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Specfic configuration for production
app.configure('production', function(){
  app.use(express.errorHandler()); 
});


//Everyauth configuration
//everyauth.helpExpress(app);


//DB Connection on localhost
var db = new Db('eventington', new Server("127.0.0.1", 27017, {}), {native_parser:false});


// Routes
require("./routes/home")(app);
require("./routes/geo")(app);
require("./routes/search")(app);
require("./routes/event")(app);




// Only listen on $ node app.js
if (!module.parent) {
  //open the database - can't do anything if this isn't working
  db.open(function(err,db) {
    util.log("Opened database");    
    if (db == null) {
      throw new Error("Mongo db is probably not started.");
    }
    app.db = db;
    
    
    
    /*
     * Function to start listening
     */
    var startApp = function() {
      app.listen(3005);    
      //util.log("Loaded geocodeCollection index");
      util.log("DB Opened and Express server listening on port " +  app.address().port);  
    };
    
    var onLocationCollection = function(err, collection) {
      if (err) { console.log(err); }
      
      util.log("Loaded location collection");
      
      app.locations = collection;
      startApp();
    } 
    
    /*
     * When we have the date index created, start the App Listening
     */
    var onEnsureDateIndex = function(err, indexName) {
      if (err) { console.log(err); }
      util.log("Loaded events.date index");
      
      //now load the locations collection
      app.db.collection('locations', onLocationCollection);
      
    };
    
    /*
     * When the location index is created, create the date index. 
     */
    var onEnsureLocationIndex = function(err, indexName) {
      if (err) { console.log(err); }
      util.log("Loaded events.location index");
      app.events.ensureIndex({date: 1}, onEnsureDateIndex);        
    };
    
    /*
     * When we have the events collection, create the location index.
     */
    var onGetEvents = function(err, collection) {
      if (err) { console.log(err); }
      util.log("Loaded events collection");
      app.events = collection;
      app.events.ensureIndex({loc: "2d"}, onEnsureLocationIndex);
    };
    
    
    /*
     * Open the collection and start the chain of events.
     */
    app.db.collection('events', onGetEvents);
       
  });
  
}
