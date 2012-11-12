var User = require('../models').User
  , Session = require('../models').Session;

module.exports.validateSignup = function(req, res, next) {

  req.validate('username', 'Invalid username.  Try just letters and numbers').is(/^[a-zA-Z0-9_-]{3,20}$/);
  req.validate('password', 'Invalid password').is(/^.{3,20}$/);
  req.validate('verify', 'Password must match').equals(req.body.password);
  if (req.body.email) {
    req.validate('email', 'Invalid email').is(/^[\S]+@[\S]+\.[\S]+$/);
  }

  if (req.validationErrors(true)) {
    return res.render('users/signup', {
      title: 'Sign up Errors',
      username: req.body.username,
      email: req.body.email,
      errors: req.validationErrors(true)
    });
  }

  req.errors = req.validationErrors(true);
  next();
};

module.exports.newUser = function(req, res, next) {

  User.findOne({_id: req.body.username}, function(err, user) {
    if (err) return console.error('problem accessing newUser');

    if (user) {
      req.validate('username', 'Username already in use. Please choose another').isNull();
      return res.render('users/signup', {
        title: 'Sign up Errors',
        username: req.body.username,
        email: req.body.email,
        errors: req.validationErrors(true)
      });
    }

    // create newUser
    var newUser = new User({
      _id: req.body.username,
      email: req.body.email
      });
    newUser.password = newUser.makePwHash(req.body.password);
    newUser.save(function(err) {
      if (err) {
        console.log('error saving document');
        return res.render('signup', {
          title: 'Signup Errors',
          username: req.body.username,
          email: req.body.email
        });
      }
    });
    next();
  });
};

module.exports.loginCheck = function(req, res, next) {

  console.log(req.cookies.session);
  var cookie = req.cookies.session;
  if (typeof cookie === "undefined") {
    console.log('no cookie');
    return res.redirect('/login');
    }

  var session_id = new Session().checkSecureVal(cookie);
  console.log('session id: ' + session_id);

  if (typeof session_id === "undefined") {
    console.log('no secure session_id');
    return res.redirect('/login');
  }

  // lookUp username record
  Session.findOne({_id: session_id}, {username: 1, _id: 0}, function(err, user) {
    if (err) {
      console.log('login check error');
      return res.redirect('/login');
    }
    if (typeof user === "null") {
      console.log('user not in session');
      return res.redirect('/login');
    }
    req.user = user.username;
    next();
  });
};

// check secure session
module.exports.checkSecSess = function(req, res, next) {

  if (typeof req.cookies.session === "undefined") {
    console.log('no cookie...');
    return res.redirect('/login');
  }

  var cookie = req.cookies.session;
  var session_id = new Session().checkSecureVal(cookie);

  if (typeof session_id === "undefined") {
    console.log('no secure session_id');
    return res.redirect('/login');
  }

  req.session_id = session_id;
  next();
};

module.exports.validateLogin = function(req, res, next) {

  // STUDENTS: FILL IN THE NEXT LINE OF CODE. THE TASK IS TO QUERY THE USERS COLLECTION
  // USING THE find_one METHOD, QUERYING FOR A USER WHO'S _id IS THE username
  // PASSED INTO VALIDATE LOGIN. ASSIGN THER RESULT TO A VARIABLE CALLED user

  console.info('About to retrieve document from users collection for username');
  User.findOne({_id: req.body.username}, function(err, user) {
    if (err) {
      console.error('Unable to query database for user');
      return res.redirect('/login');
    }
    if (typeof user === "undefined" || typeof user === "null") {
      console.info('User not in database');
      return res.render('login', {
        title: 'Login Error',
        username: req.body.username,
        loginError: 'Invalid Login'
      });
    }

    var password = user.password.split(',')[0];
    var salt = user.password.split(',')[1];
    console.log(user.password);
    console.log(password, salt);
    console.log(new User().authenticate(user.password, password, salt));

    if (!new User().authenticate(user.password, password, salt)) {
      console.log('user password is not a match');
      return res.render('login', {
        title: 'Login Error',
        username: req.body.username,
        loginError: 'Invalid password'
      });
    }

    next();
  });
};