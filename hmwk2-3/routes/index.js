var mid = require('../middleware/middleware')
  , controllers = require('../controllers')
  , home = controllers.Home
  , user = controllers.User;

module.exports = function( app ){
  //Home page -- list of blogs to display
  app.get( '/', home.index );

  //signup
  app.get( '/signup', user.presentSignup );
  app.post( '/signup', mid.validateSignup, mid.newUser, user.processSignup );

/*
  In order to signUp the user input must pass sanitation, validation and uniqueness.
  To get this working the route has to list middleware here OR
  in the controller processSignup.

  Which one?
  Do I follow 'best-practice' in express or follow the 10gen model?
  Or both?
  One for 10gen and one for my site.
*/


  // login
  app.get('/login', user.presentLogin);
  app.post('/login', mid.validateLogin, user.processLogin);

  // welcome
  app.get('/welcome', mid.loginCheck, user.presentWelcome);

  // logout
  app.get('/logout', mid.checkSecSess, user.processLogout);

  // internal error
  app.get('/internal_error', function() {
    res.render('errorTemplate', {
      title: 'Internal Error',
      error: 'something went wrong :('
    });
  });
};