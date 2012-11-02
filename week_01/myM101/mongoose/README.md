On using MONGOOSE.js
====================
* * *
The `hw1-2_*.js` file is a translation of the `hw1-2.py` using the [mongoose](http://mongoosejs.com/index.html) ODM for [Node.js](http://nodejs.org/).  

`hw1-3_stream.js` is also a translation of `hw1-3.py`.  In this case I simply used `node.js` `http` module to setup a server and stream the required data when requested.

`mongoose` is an ODM driver supported by 10gen that helps with high-level data modeling functions (see [here](http://www.mongodb.org/display/DOCS/Node.js) for more info).

Throughout the [10gen course](https://education.10gen.com/) I will be using `mongoose` to translate between the homework assignments written in `python`.  

Below are some useful tips and resources.

Connecting to MongoDB
---------------------
* * * 

There are a variety of ways to connect to MongoDB.  
I prefer to use parameters:  
    
*  `mongoose.connect(host, database, port, options)`  

Checkout out the new [docs](http://mongoosejs.com/docs/connections.html) and old [docs](http://mongoosejs.com/docs/2.8.x/index.html)


Querying
--------
* * *

####Field selection of data####
Must explicitly state that you do not want the `_id` field.  

* [retreiving data without _id field](http://stackoverflow.com/questions/9598505/mongoose-retrieving-data-without-id-field)

Checkout the [docs](http://mongoosejs.com/docs/queries.html)

####Streaming####
I like it!  
new docs [QueryStream](http://mongoosejs.com/docs/api.html#querystream_QueryStream)  
old docs [Query Streams](http://mongoosejs.com/docs/2.8.x/docs/querystream.html)

Nuanaces
--------
* * *

Must define schema first to create a collections model.  
The ususal approach is:  

*  `BlogSchema = new Schema({'setup schema here' : String});  
    Blog = mongoose.model('Blog', BlogSchema);`

You can achieve the same without specifiying a schema:  

*  `BlogSchema = new Schema();  
    Blog = mongoose.model('Blog', BlogSchema);`

When dealing with `http` and `mongoose` in node I find it easier to pass-on the `mongoose.connection` as a `db` object and proceed from there (see hw1-3_stream.js).