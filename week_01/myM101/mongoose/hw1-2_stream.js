var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var db = mongoose.connect('localhost', 'm101', '27017').connection;

db.on('error', console.error.bind(console, 'Could not connect to mongo server'));
db.on('open', function(ref) {

  // create `nums` instance model
  var nums = db.model('funnynumbers', new Schema({value: Number}, {safe: true}));
  var magic = 0;


  // stream data
  var stream = nums.find().stream();
  
  stream.on('error', function(err) {
    console.error("Error trying to stream from collection:" + err);
  });

  stream.on('data', function(doc) {
    if ((doc.value % 3) === 0) {
      magic += doc.value;
    }
  });

  stream.on('close', function(){
    console.log("The answer to Homework One, Problem 2 is " + magic);
    db.close();
  });

});
