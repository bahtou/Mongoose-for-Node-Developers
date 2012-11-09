/*
  List of models
*/
var mongoose = require('mongoose');

module.exports.User = mongoose.model( 'users', require('./schemas/user') );
module.exports.Session = mongoose.model('sessions', require('./schemas/sessions') );


/*
  various ways to register a model
    (1) As seen above
    (2)  UserSchema = require('.../user');
         mongoose.model('User', UserSchema);
    (3)  User = mongoose.model('User');
*/
/*
  need to create the user model with the following functionalities:

    user.validate_signup  -- keep track of errors through regular expressions
    user.newuser          -- hash password and insert in db
    user.start_session    -- insert session id to db
    user.make_secure_val  -- hash cookie value

    BUILT-IN
    response.set_cookie
    response.redirect('/welcome')
*/
