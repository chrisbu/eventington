//default route for index.html.

module.exports = function(app) {
  
  var index = function(req, res) {
    res.render('index', {
      title: 'Map'
    });
  };
  
  app.get('/', index);
  app.get('/index.htm', index);
  app.get('/index.html', index);
    
};