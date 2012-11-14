var mongoose = require('mongoose');

mongoose.set('debug', true);
var conn = mongoose.connect('localhost', 'school', {safe: true});
var db = conn.connection;

var students = db.model('students', new mongoose.Schema({
  _id: Number,
  name: String,
  scores: []
  },
  {safe:true}
  )
);

students.find({}).exec(function(err, grades) {
  if(err) return console.log('error accessing db: ' + err);
  // 'grades' is an array with objects
  // 'for' blocks

  var len = grades.length;
  for(var i = 0; i < len; i++) {

    var index = grades[i].scores[2].score > grades[i].scores[3].score ? 3 : 2;
    var id = grades[i]._id;
    var lowestScore = grades[i].scores[index];

    // console.log(grades[i]);
    // console.log(id, lowestScore);

    students.findByIdAndUpdate(id, {$pull: {scores: lowestScore}}).exec();
  }

  mongoose.disconnect();
});