/*
  List of models
*/
var mongoose = require('mongoose');

module.exports.User = mongoose.model( 'users', require('./schemas/users') );
module.exports.Session = mongoose.model('sessions', require('./schemas/sessions') );
module.exports.Posts = mongoose.model('posts', require('./schemas/posts') );

/*
  various ways to register a model
    (1) As seen above
    (2)  UserSchema = require('.../user');
         mongoose.model('User', UserSchema);
    (3)  User = mongoose.model('User');
*/
