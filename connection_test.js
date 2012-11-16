var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

mongoose.connect('localhost', 'students', '27017');
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to mongo server'));

// define schema -- can be `new Schema;`
var gradesSchema = new Schema(
                            { student_id: Number,
                              type: String,
                              score: Number}
                          , { safe: true}
                            );

// model handler
var grades = mongoose.model('grades', gradesSchema);
grades.find({}).exec(function(err, data) {
  if (!err) return console.log('hi');
});

grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1});
