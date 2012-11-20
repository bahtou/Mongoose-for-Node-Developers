WEEK 3 Homework
===============

---

#Update 20/11/2012 14:02

*  In middleware, updated the `validateLogin()` db query error to redirect to `internal_error`
*  In `validateLogin()` updated login error when username not found in database `loginError: 'Unknown user name'`
*  `processLogout()` now uses `res.clearCookie`
*  In `processLogin()`, updated `res.cookie` to `{signed: true}`.  Then updated the `req.signedCookies` in `loginCheck()`.  Also for `processSignup()`

> From the last item on the list I ran into a problem regarding 'req.signedCookies.name'.  After upgrading to `express 3.0.3` the problem goes away.

> Note that in `package.json` I updated the express dependency.

##hmwk3-1
The crux of this assignment is the update  
`students.findByIdAndUpdate(id, {$pull: {scores: lowestScore}}).exec()`  
The schema must identify the fields so that mongoose can apply all of its functionalities to the fields.

##hmwk3-2 and hmwk3-3

* Added `post` schema with `comments`  
* Added `validateComment` middleware
* Added `blog` controller

In the `post` schema I use the [moment.js](http://momentjs.com/) module to format the displayed date.  
I setup a `{get: fixDate}` in the [schema](http://mongoosejs.com/docs/api.html#schematype_SchemaType-get).  

###Middleware
modified `loginCheck()`   
`validateComment()` checks for user input and querys db  


###Templates
I changed some of the templates to display the errors in red  
Internal error redirect is modified to identify errors more clearly  


###TODO
*  Have user be able to use [markdown](http://daringfireball.net/projects/markdown/syntax) syntax
*  Modularize some repeated functionalities such as queries
*  Implement [bootstrap](https://github.com/bahtou/m101_mongodb_blog)
*  Improve cookies/sessions usage

####Notes
I spent a majority of the time trying to figure out how the layout of my work should be.  
What middleware to use when.  
What middleware to have?  
How should the controllers be implements?  
What funcationality should controllers have?  
etc.  