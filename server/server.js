'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var auth = require('loopback-jwt')(app,{
  secretKey: 'anuj123',
  model: 'models/chats'
});

app.use('/chats',auth.authenticated,function(req,res,next) {
  debug("has valid token",req.user);
  next();
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token, or no token supplied');
  } else {
      res.status(401).send(err);
  }
});


app.start = function() {  
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
