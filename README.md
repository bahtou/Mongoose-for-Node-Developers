**WEEK 2 Homework**
===================

---

**hmwk 2.2**
---------

> Write a program in the language of your choice that will remove the lowest homework score for each student from the dataset that you imported in HW 2.1.



**hmwk 2.3**
---------
>Following the model/view/controller model:  

>*   `user.py` is the model.  
*   `blog.py` is the controller.  
*   The templates comprise the view.  

<br>
<br>
checkout **`validate_code.py`** for the test translation
Summary
=====
---

I tried as much as possible to translate from the python code to JS.  
You will notice that in the python code there is repeated code.  This was carried over to JS.  
When in doubt about something I stuck with the python code layout.  

I did not have time to translate the `validate.py` but you can test that the `node` version works by copying the generated signup name and follow the logout/login and checking through the browser the cookies.  

###**Code organization**###

hmwk2-3  
|--- +configs  
|---------| -index.js  
|--- +controllers  
|---------| -home.js  
|---------| -index.js  
|---------| -user.js  
|--- +models  
|---------| +schemas  
|--------------| -sessions.js  
|--------------| -user.js  
|---------| -index.js  
|---------| -mongoDB.js  
|--- +public  
|--- +routes  
|---------| -index.js  
|--- +views  
|---------| +user.jade  
|--------------| -signup.jade  
|---------| -errorTemplate.jade  
|---------| -index.jade  
|---------| -layout.jade   
|---------| -login.jade  
|---------| -welcome.jade  
|--- -blog.js  
|--- -package.json  

####**MongoDB**####
Hooking up `mongo` is done by pass the `configs/index.js` to `models/mongoDB.js` in the `./blog.js`

####**controllers**####
This is where most of the logic resides: processing requests and responses.  
The code looks spaghetti-like and as the course progresses hopefully it'll get better.  

####**views**####
Have a look at [jade.js](http://jade-lang.com/), [Jade Syntax Doc](http://naltatis.github.com/jade-syntax-docs/) and of course [html-to-jade](http://html2jade.aaron-powell.com/).  
I tried to copy the python templates as close as possible.

####**notes taken while working**####
Didn't know where to put the 'extra' functions.  
Either in the schema or at the bottom of the `controllers/user.js` file.

Many connections
  `connection = pymongo.Connection(connection_string, safe=True)`

Validating format on the client-side:  

*  Username
*  Password and Verify are equal
*  Email

Validating on the server-side:  

*  Username unique
*  Email unique ?  

Why 'mySecret' is passed through the session middleware and not the cookieParser middleware.
[cookieParser('mySecret') vs session({secret: 'mySecret'})](https://groups.google.com/forum/?fromgroups=#!topic/express-js/4Z8Ryu-9HLg)  

###Using Mongoose validator and express-validator.js and passport.js###

---

[client vs server side validation](http://stackoverflow.com/questions/162159/javascript-client-side-vs-server-side-validation#162579)  

*  Validation should be done on both client and server side.  
Client side because it provides for a better user experience.
Server sider because a client may not have JS turned on, because client side is vulnerable to abuse and because it will protect against a malicious user.  

[mongoose validation](http://mongoosejs.com/docs/validation.html)  

*  Validate on save only those parameters defined in the schema  

[express-validator.js](https://github.com/ctavan/express-validator)  

*  Validate input parameters
*  Notes:
    `req.assert(param, message).condition();` should be allowed to provide multiple failover messages.  For example, `req.assert(param, [msg1, msg2, msg3]).cond1().cond2().cond3();` each condition triggering its associated message.  This would be useful if there are multiple validations for a single input parameter.

[passport.js](http://passportjs.org/)  

*  Authentication for Node.js



You can directly use MongoDB to check whether a username already exists by adding an option in the UserSchema `{unique: true}`.  Then rely on MongoDB returning an error when creating a new users `User.create`.  


###Exporting Modules###

---
By registering the schema **`user.js`**  
// register the `User` schema at the end of the file for export
`mongoose.model('User', UserSchema);`  

**`controller.js`**  
// call the registered model
`User = mongoose.model('User');`  

By exporting the schema itself **`user.js`**  
`module.exports = UserSchema;`

**`controller.js`**  
`var User = require('../controllers');  `

---

There are also other reasons/ways that are associated with exporting modules.  

**`routes/index.js`**  
`module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {title: 'Express'})
  });
};`

then in **`app.js`**  
require('./routes/index')(app)  
OR  
var routes = require('./routes/index');
routes(app);

---

Another way to think about `module.exports` is in the context of schemas and models within `mongoose`.  

Take a look at **`models/schemas/user.js`**.  
Near the bottom I have provided two methods on referring to this model.  
To put this into use look at `models/index.js`.  Here we are calling the schema to register a model.  
Depending on how you want to call the schema depends on how you 'exported' the schema.  

Compare the three ways present.

**The question is then:**  
What consumes more resources?  
Calling the db directly (`mongoose.model`) or calling `require`?

###Schema Design###

---
This step takes more thought.  
For example, how should a document be represented in the db.  
Can a user signup with multiple unique `username`s but with the same `email`?  
Should the `username/email` pair be unique?  How does this impact user experience?  
As you can imagine these are very important decisions to take into consideration when designing a schema.  Just keep them in mind.  