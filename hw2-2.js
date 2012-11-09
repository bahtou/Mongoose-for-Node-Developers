/*
  homework 2.2
  Write a program in the language of your choice that will remove the lowest homework
  score for each student from the dataset that you imported in HW 2.1.
*/

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

// instance of query
var data = grades.find({type: 'homework'}, {safe: true}).sort('student_id -score');

data.exec(function(err, docs) {
  // `docs` is an array populated with objects
  if (err) {console.error('Error on db execution: ' + err); return;}

  var len = docs.length - 1;
  // search through and remove documents
  for(i=0; i < len; i++) {
    if (docs[i].student_id == docs[i + 1].student_id) {
      grades.remove({_id: docs[i+1]._id}).exec();
      }
    }
});

/*
  The code below is unnecessary.  You can check if the above execution worked by
  using the Mongo Shell.
  
  Because of async nature nature of JS the code will be executed while waiting on
  `data.exec` to finish, hence the `setTimeout`
*/

// wait 5 seconds and then execute
setTimeout( logIT, 5000);

function logIT ()
{
  grades.find(function(err, docs) {
    console.log(docs.length);
    grades.find().sort('-score').skip(100).limit(1).exec(function(err, doc) {
      console.log(doc);
      grades.find().select({'student_id':1, 'type':1, 'score':1, '_id':0}).sort({student_id: 1, score: 1}).limit(5).exec(function(err, docs) {
        console.log(docs);
        db.close();
      });
    });
  });
}

/*
  Execute the code below in the MONGO SHELL to get your answer
  db.grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1})
*/
