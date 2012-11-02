/*
  Using Streams
*/
var mongo = require('mongodb')
  , Server = mongo.Server
  , Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true, poolSize: 5});
var db = new Db('m101', server, {safe: true});

db.open(function(err, db) {

  if (err) {
    console.error("Error opening the database: " + err);
    return;
  }

  db.collection('funnynumbers', {safe: true}, function(err, collection) {
    var stream = collection.find().stream();
    var magic = 0;

    stream.on('data', function(item) {
      if ((item.value % 3) === 0) {
        magic += item.value;
      }
    });

    stream.on('error', function(err) {
      console.error("Error trying to read collection: " + err);
    });

    stream.on('close', function() {
      console.log("The answer to Homework One, Problem 2 is " + magic);
      db.close();

    });
  });
});