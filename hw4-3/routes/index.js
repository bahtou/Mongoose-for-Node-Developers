var mid = require('../middleware/middleware')
  , controllers = require('../controllers')
  , blog = controllers.Blog
  , user = controllers.User;

module.exports = function( app ){
  //Home page -- list of blogs to display
  app.get( '/', mid.loginCheck, blog.blogIndex);

  //signup
  app.get( '/signup', user.presentSignup );
  app.post( '/signup', mid.validateSignup, mid.newUser, user.processSignup );

  // login
  app.get('/login', user.presentLogin);
  app.post('/login', mid.validateLogin, user.processLogin);

  // welcome
  app.get('/welcome', mid.loginCheck, user.presentWelcome);

  // logout
  app.get('/logout', mid.checkSecSess, user.processLogout);

  // posts
  app.get('/newpost', mid.loginCheck, blog.getNewPost);
  app.post('/newpost', mid.loginCheck, blog.postNewPost);
  app.get('/post/:permalink', mid.loginCheck, blog.showPost);

  // tags
  app.get('/tag/:tag', mid.loginCheck, blog.postsByTag);

  // comments
  app.post('/newcomment', mid.loginCheck, mid.validateComment, blog.postNewComment);

  // post not found
  app.get('/post_not_found', blog.postNotFound);

  // internal error
  app.get('/internal_error/:where/:errCode/:err', function(req, res) {
    res.render('errorTemplate', {
      title: 'Internal Error',
      username: '',
      where: req.params.where,
      error: req.params.err
    });
  });
};
