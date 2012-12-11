var posts = require('../models').Posts;

module.exports.blogIndex = function( req, res ) {
  var username = (!req.user) ? '': req.user;

  posts.find({}, {}, {skip: 0, limit: 10, sort: {date: -1}}, function( err, posts) {
    if (err) return res.redirect('/internal_error/blogIndex/' + err.code +'/' + err);

    res.render('blogTemplate', {
      title: 'My Blog',
      username: username,
      posts: posts
    });
  });
}; // end blog index

module.exports.getNewPost = function(req, res) {
  res.render('newpost', {
    title: 'Create a new post',
    subject: '',
    body: '',
    errors: '',
    tags: '',
    username: req.user
  });
}; // end get new post

module.exports.postNewPost = function(req, res) {
  console.log('postNewPost begin');

  if (!req.body.subject || !req.body.body) {
    errors = 'Post must contain a title and blog entry';
    return res.render('newpost', {
      title: 'Create a new post',
      subject: req.body.subject,
      body: req.body.body,
      errors: errors,
      tags: req.body.tags,
      username: req.user
    });
  }

  if (!req.body.tags)
    req.body.tags = '';

  var whiteSpace = new RegExp("\\s", "g");
  var exp = new RegExp("\\W", "g");
  var tags = req.body.tags.replace(whiteSpace, '').split(',');
  var permalink = req.body.subject.replace(whiteSpace, '_').replace(exp, '');

  var post = new posts({
                title: req.body.subject,
                author: req.user,
                date: new Date(),
                body: req.body.body,
                permalink: permalink,
                tags: tags
              });

  post.save(function(err) {
    if (err) return res.redirect('/internal_error/postNewPost/' + err.code +'/' + err);
    
    console.log('postNewPost ending with redirect');
    return res.redirect('/post/' + permalink);
  });
}; // end post newpost

module.exports.showPost = function(req, res) {
  console.log('showPost begin');
  posts.findOne({permalink: req.params.permalink}, function(err, post) {
    if (err) return console.error('unable to query for permapost -- db error: ' + err);

    if(!post) return res.redirect('/post_not_found');

    console.log('date of entry is ', post.date);
    // date is fixed through mongoose getter

    // initalize comment form fields
    var comment = {};
    comment.author = '';
    comment.email = '';
    comment.body = '';

    res.render('entryTemplate', {
      title: 'Blog Post',
      post: post,
      username: req.user,
      errors: '',
      comment: comment
    });

    console.log('showPost end');
  });
}; // end show post

module.exports.postNewComment = function(req, res) {
  // it all looks good, insert the comment into the blog post and redirect back to the post viewer
  console.log('posting new comment begin');
  var post = req.post;
  post.comments.push(req.comment);

  posts.findOneAndUpdate({permalink: req.body.permalink}, {$set: {comments: post.comments}}, {new: true}).exec(function(err, post) {
    if (err) return res.redirect('/internal_error/postNewComment/' + err.code +'/' + err);

    console.log("newcomment: added the comment....redirecting to post");
    return res.redirect('/post/' + req.body.permalink);
  });
}; // end post new comment

module.exports.postNotFound = function(req, res) {
  res.render('postNotFound', {
    title: 'Post Not Found',
    username: req.user
  });
}; // end of post not found

module.exports.postsByTag = function(req, res) {
  console.log('posts by tag begin');
  posts.find({tags: req.params.tag}).sort({date: -1}).limit(10).exec(function(err, posts) {
    if (err) return res.redirect('/internal_error/postsByTag/' + err.code +'/' + err);

    console.log(posts.length + ' tags retrieved');
    res.render('blogTemplate', {
      title: 'Blog by Tags',
      username: req.user,
      posts: posts
    });

    console.log('posts by tag end');
  });
}; // end of posts by tag
