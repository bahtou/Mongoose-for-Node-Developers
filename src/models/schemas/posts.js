var mongoose = require('mongoose')
  , moment = require('moment');

var postsSchema = module.exports = new mongoose.Schema({
    title: {type: String, require: true},
    author: String,
    date: {type: Date, get: fixDate},
    body: {type: String, require: true},
    permalink: String,
    comments: [],
    tags: [String]
  },
  {
    collection: 'posts',
    safe: true
  }
);

// format the date
function fixDate(date) {
  return moment(date).format('dddd[,] MMMM D YYYY [at] h:mm a');
}

// indexes
postsSchema.index({date: -1, tags: 1, permlink: 1});
