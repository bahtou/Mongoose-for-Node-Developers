/*
  Using `.each()`
*/

var mongo = require('mongodb')
  , Server = mongo.Server
  , Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true, poolSize: 5});
var db = new Db('m101', server, {safe: true});

db.open(function(err, db) {

  db.collection('funnynumbers', {safe: true}, function(err, collection) {

    if (err) {
      console.error("Error trying to read collection: " + err);
      return;
    }

    var magic = 0;
    collection.find().each(function(err, item) {

      if (item === null) {
        console.log("The answer to Homework One, Problem 2 is " + magic);
        db.close();
      }
      else if ((item !== null) && ((item.value % 3) === 0)) {
          magic += item.value;
        }
    });

  });
});
