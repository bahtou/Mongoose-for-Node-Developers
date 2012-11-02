/*
  Using `exec`
*/

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var db = mongoose.connect('localhost', 'm101', '27017').connection;

db.on('error', console.error.bind(console, 'Could not connect to mongo server'));
db.on('open', function(ref) {

  // create `nums` instance model
  var nums = db.model('funnynumbers', new Schema({value: Number}, {safe: true}));
  var magic = 0;


  // `data` is an array
  nums.find().exec(function(err, data) {
    // forEach is blocking
    data.forEach(function(item, index, array) {
      if ((item.value % 3) === 0) {
        magic += item.value;
      }
    });


    console.log("The answer to Homework One, Problem 2 is " + magic);
    db.close();

  });
});
