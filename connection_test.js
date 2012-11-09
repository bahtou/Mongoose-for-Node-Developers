var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var db = mongoose.connect('localhost', 'students', '27017').connection;

db.on('error', console.error.bind(console, 'Could not connect to mongo server'));

// define schema -- can be `new Schema;`
var gradesSchema = new Schema(
                            { student_id: Number,
                              type: String,
                              score: Number}
                          , { safe: true}
                            );

// model handler
var grades = db.model('grades', gradesSchema);

grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1});
