var env = process.env.NODE_ENV || 'development'
  , express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./configs')[env]
  , mongo = require('./models/mongoDB')
  , expressValidator = require('express-validator');

var app = express();

// mongoDB connection
mongo.connect(config.mongodb, function(err) {
  if (err) {
    throw err;
  }
  console.info('Connected to Mongo');
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressValidator);
  app.use(express.cookieParser('m101Blog'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
