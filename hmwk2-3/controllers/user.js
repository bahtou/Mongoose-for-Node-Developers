var User = require('../models').User
  , Session = require('../models').Session;


// present sign up
module.exports.presentSignup = function( req, res ) {
  res.render('users/signup', {
    title: 'Sign up'
  , username: ''
  , email: ''
  , errors: ''
  });
}; //end sign up

// process sign up
module.exports.processSignup = function(req, res) {
  // if no validation errors and a newUser, start session
  var session = new Session({
    username: req.body.username
  });

  session.save(function(err) {
    if(err) {
      console.log('error saving session');
      return res.redirect('/signup', {
        title: 'Signup Error',
        username: req.body.username,
        email: req.body.email
      });
   }
  });

  // set cookie
  var cookie = session.makeSecureVal(session._id.toString());
  res.cookie('session', cookie);
  res.redirect('/welcome');
}; //end processSignup

// welcome
module.exports.presentWelcome = function(req, res) {
    if (typeof req.user === "undefined") {
      console.log("welcome: can't identify user...redirecting to signup");
      return res.redirect('/signup');
    }

    res.render('welcome', {
      title: 'Welcome',
      username: req.user
    });
}; //end welcome

// logout
module.exports.processLogout = function(req, res) {
  // remove the session
  endSession(req.session_id, function() {
    console.log('clearing the cookie');
    res.cookie('session', '');
    res.redirect('/login');
  });
}; // end logout

// present login
module.exports.presentLogin = function(req, res) {
  res.render('login', {
    title: 'Login',
    username: '',
    loginError: ''
  });
};

// process login
module.exports.processLogin = function(req, res) {
  // looks good. start a new session
    var session = new Session({
        username: req.body.username
      });

    session.save(function(err) {
      // TODO: need to correct for duplication
      if (err) {
        console.error('error saving session: ' + err);
        return res.redirect('/login');
      }

      var session_id = session._id.toString();
      if (!session_id) return res.redirect('/internal_error');

      // set cookie
      var cookie = session.makeSecureVal(session_id);
      res.cookie('session', cookie);
      res.redirect('/welcome');
    });
};

// useful functions

  // end session
function endSession(session_id, cb) {
  Session.remove({_id: session_id}, function(err, succes) {
    if (err) return console.log('err removing session');
    cb();
  });
}
