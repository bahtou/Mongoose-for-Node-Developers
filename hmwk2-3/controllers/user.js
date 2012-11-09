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
  req.assert('username', 'Invalid username.  Try just letters and numbers').is(/^[a-zA-Z0-9_-]{3,20}$/);
  req.assert('password', 'Invalid password').is(/^.{3,20}$/);
  req.assert('verify', 'Password must match').notEmpty().equals(req.body.password);
  if (req.body.email) {
    req.assert('email', 'Invalid email').is(/^[\S]+@[\S]+\.[\S]+$/);
  }

  var errors = req.validationErrors(true);
  // if no validation errors, proceed to check for unique username
  if (!errors) {
    User.findOne({_id: req.body.username}, function(err, user) {
      if (!user) {
        var newUser = new User({
          _id: req.body.username,
          password: '',
          email: req.body.email || ''
          });
        var password = newUser.makePwHash(req.body.password);
        newUser.password = password;
        newUser.save(function(err) {
          if (err) res.send('error saving document');
        });

        // start session
        var session = new Session({
          username: req.body.username
        });
        session.save(function(err) {
          if(err) res.send('err saving session');
        });
        var session_id = session._id.toString();

        // set cookie
        var cookie = session.makeSecureVal(session_id);
        res.cookie('session', cookie);
        res.redirect('/welcome');
      }
      else {
        req.assert('username', 'Username already in use. Please choose another').isNull();
        var errors = req.validationErrors(true);
        res.render('users/signup', {
          title: 'Sign up Errors',
          username: req.body.username,
          email: req.body.email,
          errors: errors
        });
      }
    });
  }
  else {
    res.render('users/signup', {
      title: 'Sign up Errors',
      username: req.body.username,
      email: req.body.email,
      errors: errors
    });
  }
}; //end processSignup

// welcome
module.exports.presentWelcome = function(req, res) {
  // check for cookie, if present, then extract value

  loginCheck(req, function(username) {
    if (typeof username === "undefined") {
      console.log("welcome: can't identify user...redirecting to signup");
      res.redirect('/signup');
    } else {
        res.render('welcome', {
          title: 'Welcome',
          username: username
        });
      }
    });
}; //end welcome

// logout
module.exports.processLogout = function(req, res) {
  var cookie = req.cookies.session;
  if (typeof cookie === "undefined") {
    console.info('no cookie... ');
    return res.redirect('/signup');
  } else {
    var session_id = new Session().checkSecureVal(cookie);
    if (typeof session_id === "undefined") {
      console.info('no secure session_id');
      return res.redirect('/signup');
    } else {
      // remove the session
      endSession(session_id, function() {
        console.log('clearing the cookie');
        res.cookie('session', '');
        res.redirect('/signup');
      });
    }
  }
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
  validateLogin(req.body.username, req.body.password, function(user) {
    if (typeof user === "undefined" || typeof user === "null") {
      return res.render('login', {
        title: 'Login Error',
        username: req.body.username,
        loginError: 'Invalid Login'
      });
    } else {
      // looks good. start a new session
      var session = new Session({
          username: req.body.username
        });
      session.save(function(err) {
          if(err) res.send('err saving session');
        });
      var session_id = session._id.toString();
      if (!session_id) return res.render('/internal_error');

      // set cookie
      var cookie = session.makeSecureVal(session_id);
      res.cookie('session', cookie);
      res.redirect('/welcome');
    }
  });
};

// useful functions

  // login check
function loginCheck(req, cb) {
  var cookie = req.cookies.session;

  if (typeof cookie === "undefined") {
    console.log('no cookie');
    return cookie;
  } else {
      var session_id = new Session().checkSecureVal(cookie);

      if (typeof session_id === "undefined") {
        console.log('no secure session_id');
        return cb(session_id);
      } else {
        // lookUp username record
        Session.findOne({_id: session_id}, {username: 1, _id: 0}, function(err, user) {
          return cb(user.username);
        });
      }

  }
}

  // end session
function endSession(session_id, cb) {
  Session.remove({_id: session_id}, function(err, succes) {
    if (err) return console.log('err removing session');
    cb();
  });
}

  // validateLogin
function validateLogin(username, password, cb) {
  // STUDENTS: FILL IN THE NEXT LINE OF CODE. THE TASK IS TO QUERY THE USERS COLLECTION
  // USING THE find_one METHOD, QUERYING FOR A USER WHO'S _id IS THE username
  // PASSED INTO VALIDATE LOGIN. ASSIGN THER RESULT TO A VARIABLE CALLED user
  console.log('About to retrieve document from users collection for username');
  User.findOne({_id: username}, function(err, user) {
    if(err) return console.error('Unable to query database for user');
    if (typeof user === "undefined" || typeof user === "null") {
      console.log('User not in database');
      cb(user);
    } else {
      var salt = user.password.split(',')[1];
      if (user.password != new User().makePwHash(password, salt)) {
        console.log('user password is not a match');
        cb("undefined");
      } else {
        cb(user);
      }
    }
  });
}