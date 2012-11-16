var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

mongoose.connect('localhost', 'students', '27017');
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to mongo server'));
console.log('mongoose version: %s', mongoose.version);

// define schema -- can be `new Schema;`
// var gradesSchema = new Schema(
//                             { student_id: Number,
//                               // type: String,
//                               score: Number}
//                           , { safe: true}
//                           , {_id: false}
//                             );

// model handler
var gradesSchema = new Schema({}, {_id: false});
var grades = mongoose.model('grades', gradesSchema);

grades.find({}).limit(10).exec(function(err, data) {
  if (err) {console.log('hi' + err); return mongoose.disconnect();}
  console.log(data);
});

grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1}, function(err, res) {
  if (err) {console.log('hi' + err); return mongoose.disconnect();}
  console.log(res);
  mongoose.disconnect();
});