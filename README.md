WEEK 4
========

---

Checkout **`models/schemas/posts.js`** to see *indexes* implemented in `mongoose`.  

Hyperlinked the `tags` in the `views/blogTemplate.jade` and `/entryTemplate.jade`.

Added the **`/tag/:tag`** route.  


##on Mongoose


*Mongoose* syntax on [sorting](http://stackoverflow.com/questions/4299991/how-to-sort-in-mongoose):  

     Model.find = function find (conditions, fields, options, callback) {
      if ('function' == typeof conditions) {
        callback = conditions;
        conditions = {};
        fields = null;
        options = null;  
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = null;
        options = null;
      } else if ('function' == typeof options) {
      callback = options;
      options = null;
      } 

Or  

    News.find({
    deal_id:deal._id // Search Filters
  	},
  	['type','date_added'], // Columns to Return
  	{
      skip:0, // Starting Row
      limit:10, // Ending Row
      sort:{
        date_added: -1 //Sort by Date Added DESC
    }
	  },
  	function(err,allNews){
      socket.emit('news-load', allNews); // Do something with the array of 10 objects
  	})


When your application starts up, Mongoose automatically calls ensureIndex for each defined index. It is recommended this behavior be disabled in production by setting the autoIndex option of your schema to false.

>`animalSchema.set('autoIndex', false);  
// or  
new Schema({..}, { autoIndex: false });`

