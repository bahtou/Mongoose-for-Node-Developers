/*
  homework 2.2
  Write a program in the language of your choice that will remove the lowest homework
  score for each student from the dataset that you imported in HW 2.1.
*/

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

// mongoose.set('debug', true);
mongoose.connect('localhost', 'students', '27017');
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to mongo server'));
mongoose.connection.on('open', function() {console.log('connected to mongodb'); });
// define schema -- can be `new Schema(); -- safe: true --> is the default`
var gradesSchema = new Schema(
                            { student_id: Number,
                              type: String,
                              score: Number}
                          , { safe: true}
                            );

// model handler
var grades = mongoose.model('grades', gradesSchema);

// instance of query
// var data = grades.find({type: 'homework'}).sort('student_id -score');

// data.exec(function(err, docs) {
//   // `docs` is an array populated with objects
//   if (err) {console.error('Error on db execution: ' + err); return;}

//   var len = docs.length - 1;
//   // search through and remove documents
//   for(i=0; i < len; i++) {
//     if (docs[i].student_id == docs[i + 1].student_id) {
//       grades.remove({_id: docs[i+1]._id}).exec();
//       }
//     }
// });

/*
  STREAM-ON
*/
  var datum = [];
  var stream = grades.find({type: 'homework'}).sort('student_id -score').stream();
  
  stream.on('data', function(doc) {
    datum.push(doc);
  });
  
  stream.on('close', function() {
    var len = datum.length -1;
    var i = 0;
    // while-loop blocks
    while (i < len) {
      if (datum[i].student_id == datum[i + 1].student_id) {
        console.log('yep');
        grades.remove({_id: datum[i+1]._id}).exec();
      }
      i++;
    }
    logIT();
  });

/*
  The code below is unnecessary.  You can check if the above execution worked by
  using the Mongo Shell.
*/

function logIT ()
{
  grades.find(function(err, docs) {
    console.log('length of docs: ' + docs.length);
    grades.find().sort('-score').skip(100).limit(1).exec(function(err, doc) {
      console.log(doc);
      grades.find().select({'student_id':1, 'type':1, 'score':1, '_id':0}).sort({student_id: 1, score: 1}).limit(5).exec(function(err, docs) {
        console.log(docs);
        mongoose.disconnect();
      });
    });
  });
}

/*
  Execute the code below in the MONGO SHELL to get your answer
  db.grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1})
*/
