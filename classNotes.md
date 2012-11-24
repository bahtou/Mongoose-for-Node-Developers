Week 4 class notes
==================

----

##Inroduction -- Performance
Focus on *algorithmic performance* -- for db server, how fast can we execute queries?  

Index to lookup data

*  what they are
*  how to create them
*  which parts of your program is slow

**sharding** -- breaking up large collections over multiple servers to exploit greater parallelism  

##Indexes

Are you going to use an index to resolve your query or not?  

*Death to your performance*  

*  Table Scan  
*  Collection Scan  

Indexes in mongoDB are ordered list of keys  
In order for a db to utilize an index you have to give it a left-most set.  
Must start at the top of the index (query, update or sort).  
Inserts take time because updates have to be written to the index.  

Indexes are not costless.  They take up space on disk and time to keep them updated.  

You don't have an index on all the possible ways to query an index but rather you have an index on the most likely way to query an index.  

###Quiz
Which optimization will typically have the greatest impact on the performance of a database?  

*  Adding appropriate indexes on large collections so that only a small percentage of queries need to scan the collection.

##Creating Indexes
`ensureIndex` command  
`db.students.ensureIndex({student_id: 1})`
In words: index student id in ascending order from the students collection.  

Ascending/Descending doesn't matter when searching but if you're going to sort then 1/-1 is very important.  

###Quiz
db.students.ensureIndex({class:1, student_name:1})


##Discovering Indexes
`db.system.indexes.find()`
`db.students.getIndexes()`

To drop an index:  
`db.students.dropIndex({student_id: 1})`

##Multikey Indexes
In MongoDB you can have a key that holds an array.  
When done, mongo creates a multikey index.  
Creates an index point for every item in the array.  

Compound index (tags, colors)  
Mongo restricts the query -- cannot have two items in a document that are both arrays if its a multikey index because of the olynomial explosion of index points (add/subtract from array).  

###Quiz
Suppose we have a collection foo that has an index created as follows:
`db.foo.ensureIndex({a:1, b:1})`
Which of the following inserts are valid to this collection?

*  db.foo.insert({a:["apples","oranges"]
*  b:"grapes"})db.foo.insert({a:"grapes", b:"oranges"})
*  db.foo.insert({a:"grapes", b:[8,9,10]})


##Multikey cont.
Indexing is not restricted to the first level of keys in a document.  
Example:  
`db.people.ensureIndex({addresses.tag: 1, addresses.phones: 1})`


##Index creation, UNIQUE
A unique index enforces the constraint that each key can only appear once in the index.  

Example:  
`db.stuff.ensureIndex({thing: 1}, {unique: true})`

`_id` is implicitly a unique key and a duplicate error will pop-up if user tries to insert a key with the same value.  

###Quiz
Please provide the mongo shell command to add a unique index to the collection students on the keys student_id, class_id.

`db.students.ensureIndex({student_id:1, class_id: 1}, {unique: true})`


##Index creation, REMOVING DUPS
Dangerous:  
`{unique: true, dropsDups: true}`  

When mongo goes through the collection and finds more than one document with the same key it'll remove all the documents except for one and there is no way to control which one is removed.  

###Quiz
If you choose the dropDups option when creating a unique index, what will the MongoDB do to documents that conflict with an existing index entry?  
*Delete them for ever and ever, Amen.*


##Index creation, SPARSE
What happens if we try to create a unique index on a collection and there is more than one document missing the index key?  

Missing index in the documents map to null, but unique means no duplicates.  

Sparse Index -- only index documents where keys are set.  Other documents are not queried when documents are queried on the index.  

`db.products.ensureIndex({size: 1}, {unique: true, sparse: true})`

###Quiz
Suppose you had the following documents in a collection called people with the following docs:

> db.people.find()
{ "_id" : ObjectId("50a464fb0a9dfcc4f19d6271"), "name" : "Andrew", "title" : "Jester" }
{ "_id" : ObjectId("50a4650c0a9dfcc4f19d6272"), "name" : "Dwight", "title" : "CEO" }
{ "_id" : ObjectId("50a465280a9dfcc4f19d6273"), "name" : "John" }

And there is an index defined as follows:  
`db.people.ensureIndex({title:1}, {sparse:1})`  

If you perform the following query, what do you get back, and why?  
`db.people.find({title:null})`

> No documents, because the query uses the index and there are no documents with title:null in the index.


##Index creation, BACKGROUND
Index creation by default is written in the foreground, which blocks all other writers (faster).  
You can run it in the background, which won't block other writers.  

If you run a replicate set, then pull one of the servers out of the set and build the index on that set while not bothering the others.  And will be fast.

###Quiz
Which things are true about creating an index in the background in MongoDB. Check all that apply.

*  A mongod instance can only build one background index at a time per database.
*  Although the database server will continue to take requests, a background index creation still blocks the mongo shell that you are using to create the index.
*  Creating an index in the background takes longer than creating it in the foreground

note that Mongo 2.2 and above, there is a writer block per database


##Using EXPLAIN
Explain method tell you what indexes were used in your query and how.  
Fields under 'explain()':
*  Cursor --> was index used?  BasicCursor:No, anythingElse:Yes
*  isMultiKey --> true:false
*  n --> number of documents returned
*  nscannedObjects --> number of documents scanned to answer the query
*  nscanned --> number of index entries/documents what were looked at
*  indexBounds --> bounds used in query
*  indexOnly --> whether or not if the db query can be satisfied just by index
*  millis --> time to return query

###Quiz
Given the following output from explain, what is the best description of what happened during the query?

>{
  "cursor" : "BasicCursor",
  "isMultiKey" : false,
  "n" : 100000,
  "nscannedObjects" : 10000000,
  "nscanned" : 10000000,
  "nscannedObjectsAllPlans" : 10000000,
  "nscannedAllPlans" : 10000000,
  "scanAndOrder" : false,
  "indexOnly" : false,
  "nYields" : 7,
  "nChunkSkips" : 0,
  "millis" : 5151,
  "indexBounds" : {
    
>  },
  "server" : "Andrews-iMac.local:27017"
}

The query scanned 10,000,000 documents, returning 100,000 in 5.2 seconds.


##When is an index used?
What does a database do to figure out which index to use?  

The first time it runs a query on an index (say, a-b-c) it runs the three query plan in parallel.  The first query plan to finish Mongo return answer to query and 'memorizes' which index to use.  Note mongo will do this 'experiment' in the background occasionally.  
find, findOne, update and remove can benefit from indexes.  

###Quiz
Given collection foo with the following index:  
`db.foo.ensureIndex({a:1, b:1, c:1})`  
Which of the following queries will use the index?  

*  db.foo.find({a:3})
*  db.foo.find({c:1}).sort({a:1, b:1})

note: if given as sort({a:-1}), mongo reverses order on a (but only when `a` is given)


##How large is your index?
We want our indexes to be in memory.  
So how big is an index?  

`db.students.stats()`
`db.stduents.totalIndexSize()`

###Quiz
Is it more important that your index or your data fit into memory?  
index


##Index Cardinality
How many index points are there for each different type of index that mongo supports?  
*Regular*:  1-to-1  
*Sparse*:   <= documents  
*Multikey*: > documents  

For example, if a document has to be moved.  Every index pointing to that document has to be updated.  

###Quiz
> Let's say you update a document with a key called tags and that update causes the document to need to get moved on disk. If the document has 100 tags in it, and if the tags array is indexed with a multikey index, how many index points need to be updated in the index to accomodate the move?

100  


##Index Selectivity
When designing your indexes you want them to be as selective as possible.  
If its not selective, then there is much value to specifying that index field.  

Think in terms of categorical vs. continuous data.  
If the field is categorical (only a select few possible values) then it is probably less selective than, for example, a timestamp which can be a huge range of values.

##Quiz
>Given the following attributes of automobiles: color, weight, manufacturer, odometer mileage, which index is likely be the most selective, provided you can provide all four attributes on a search:

Odometer Mileage


##Hinting an Index
If you want to tell mongo exactly which index to use, pass the `hint` command.  

`hint({$natural:1})` tells mongo to use no index

###Quiz
Given the following data in a collection:  

> db.people.find()
{ "_id" : ObjectId("50a464fb0a9dfcc4f19d6271"), "name" : "Andrew", "title" : "Jester" }
{ "_id" : ObjectId("50a4650c0a9dfcc4f19d6272"), "name" : "Dwight", "title" : "CEO" }
{ "_id" : ObjectId("50a465280a9dfcc4f19d6273"), "name" : "John" }

>and the following indexex:

> db.people.getIndexes()
[
  {
    "v" : 1,
    "key" : {
      "_id" : 1
    },
    "ns" : "test.people",
    "name" : "_id_"
  },
  {
    "v" : 1,
    "key" : {
      "title" : 1
    },
    "ns" : "test.people",
    "name" : "title_1",
    "sparse" : 1
  }
]

Which query will return the most documents?  
`db.people.find().sort({'title':1}).hint({$natural:1})`


##Hinting in Pymongo
`foo.find(query).hint([('c', pymongo.ASCENDING)]).explain()`


##Efficiency of Index Use
Operators may or may not use the index efficiently.  
On searching on regex without a stem then it will not use an index.  
Stem regex: /^abcd/  

Keep in mind that you have to consider not only what index was used but how it was used.


##Geospatial Indexes
Find things based on locations.  

2D:  Cartesian coordinates.  
Your document must have an x, y coordinate values.  
`ensureIndex({location: 2d, type: 1})`  
`.find({location: {$near: [x, y]}}`  

###Quiz
Suppose you have a 2D geospatial index defined on the key location in the collection places. Write a query that will find the closest three places (the closest three documents) to the location 74, 140.  
`db.places.find({location: {$near: [74, 140]}}).limit(3)`


##Geospatial Spherical
Lat, Long, degrees, radians  
(1 rad = 180/pi =~ 57.2958 degrees)
_theta * r = d  
`ensureIndex({location: 2d})` --> still called '2d' but queried differently.  
`db.runCommand({geoNear: 'stores', near: [50, 50], spherical: true, maxDistance: 1})`  

results are returned in order of increasing distance (closest first)  


##Logging slow queries
Mongo automatically logs slow queries (above 100ms) right to the Mongod log.  
> mongod -dbpath /users/mongodb


##Profiliing
Will write interests to the `system.profiler`  General performance feature.  

*  0  default: off
*  1  log slow queries
*  2  log all queries

> mongod -dbpath /users/mongodb --profile 1 --slowms 2
`db.system.profile.find()`

From the mongo shell:  
`db.getProfilingLevel()`  
`db.getProfilingStatus()`  
`db.setProfilingLevel(1, 4)` --> slow queries above 4ms  
`db.setProfilingLevel(0)` --> turn off  

###Quiz
Write the query to look in the system profile collection for all queries that took longer than one second, ordered by timestamp descending.  

`db.system.profile.find({millis: {$gt: 1000}}).sort({ts: -1})`


##Mongotop
*  Indexes are critical to performace
*  Explain
*  Hing
*  Profiling

`mongotop` --> high level view of where mongo is spending its time.  


##Mongostat
From iostat  
More 'systemy' info --> overall performance of mongo  
queries per second, update per second, flushes per second, etc. .  
The most interesting is the `idx miss %` --> when index is used is it hitting memory or disk.  


##Sharding Overview
Technique for splitting up a large collection among multiple servers.  
Sharding is deploying multiple mongod servers.  

Applicatoin talks to mongos (a router) and that talks to mongod (a set of servers -- replica set).  

Mongo shards by choosing a shard key.  
Insert must include entire shard key.  
Update, remove or find --> if mongos is not given a shard key, then mongos broadcasts to each collection.  

mongos is usually with the application