var http = require('http')
  , url = require('url')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , server, n;

server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname.slice(0, 4);
  n = url.parse(request.url).pathname.slice(5);

  // connect to mongo
  mongoose.set('debug', true);
  var db = mongoose.connect('localhost', 'm101', {server: {poolSize: 1}}).connection;
  db.on('error', console.error.bind(console, 'Could not connect to mongo server'));

  // create `nums` instance model
  var nums = db.model('funnynumbers', new Schema({value: Number}, {safe: true}));

  switch (path) {

    case '/hw1':

      // stream data
      var stream = nums.find({}).limit(1).skip(n).sort('value').stream();

      stream.on('error', function(err) {
        console.error("Error trying to stream from collection:" + err);
      });

      stream.on('data', function(doc) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(doc.value.toString() + '\n', 'utf8');
        response.end();
      });

      stream.on('close', function() {
        console.log('done streaming');
        db.close();
        });

      break;

    default:
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write('interNats' + '\n');
      response.end();
  }
});

server.listen(8080, function() {
  console.log('Server listening on localhost:8080');
});
