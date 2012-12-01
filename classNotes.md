Week 5 class notes
==================

----

##Simple Aggregation Example
`db.products.aggregate([ {$group: { _id: "$manufacturer", num_products: {$sum: 1} }}])`

Returns a document (can't be greater than 16MB)

`{ "result": [  
{   
"_id": "Google",  
"num_products": 1  
},  
{  
"_id": "Amazon",  
"num_products": 2  
},  
...  
]}`  

####Quiz
> Write the aggregation query that will find the number of products by category of a collection that has the form:  

>`
{  
	"_id" : ObjectId("50b1aa983b3d0043b51b2c52"),  
	"name" : "Nexus 7",  
	"category" : "Tablets",  
	"manufacturer" : "Google",  
	"price" : 199  
}  
`  

> Have the resulting key be called "num_products," as in the video lesson. Hint, you just need to change which key you are aggregating on relative to the examples shown in the lesson. 

`db.products.aggregate([ {$group: { 
_id: "$category", 
num_products: {$sum: 1}
}}])`


##The Aggregation Pipeline
From unix world of pipe|ology.  

A collection is piped through the processing pipeline.  
Many stages --> group, sorting, matching, etc.  

An array inside the function call (db.product.aggregate(['array']))  
Each item in the array is a 'stage' that the data pipes through.  

**STAGES**  
$project -- select out which keys you are interested, reshape document.  For every document sent in it produces a result for that document [1:1].  

$match -- filter [n:1]  
$group -- aggregation [n:1]  
$sort -- sort [1:1]  
$skip -- skipper [n:1]  
$limit -- limit docs [n:1]  
$unwind -- normalizes data to prepare for aggregation [1:n]  

####Quiz
Which of the following are stages in the aggregation pipeline.  
Match, Group, Skip, Limit, Sort, Project, Unwind  


##Simple Example Expanded
Walkthough on how `aggregation()` works.  

####Quiz
If you have the following collection of stuff:

> `> db.stuff.find()  
{ "_id" : ObjectId("50b26f9d80a78af03b5163c8"), "a" : 1, "b" : 1, "c" : 1 }
{ "_id" : ObjectId("50b26fb480a78af03b5163c9"), "a" : 2, "b" : 2, "c" : 1 }
{ "_id" : ObjectId("50b26fbf80a78af03b5163ca"), "a" : 3, "b" : 3, "c" : 1 }
{ "_id" : ObjectId("50b26fcd80a78af03b5163cb"), "a" : 3, "b" : 3, "c" : 2 }
{ "_id" : ObjectId("50b26fd380a78af03b5163cc"), "a" : 3, "b" : 5, "c" : 3 }`

and you perform the following aggregation:

`db.stuff.aggregate([{$group:{_id:'$c'}}])`

How many documents will be in the result set from aggregate?  

3 documents because there are 3 unique values of 'c'  


##Compound Grouping
Group by multiple keys  
From the SQL world:  
'select manufacturer, category, count(*) from products group by manufacturer, category'  

In mongo:  
`$group: {_id: {manufacturer: "$manufacturer", category: "$category"}}`  

The keys can be named anything.  Here they are 'manufacturer' and 'category'.  

Can add any number of keys.  

####Quiz
Given the following collection:

> `> db.stuff.find()  
{ "_id" : ObjectId("50b26f9d80a78af03b5163c8"), "a" : 1, "b" : 1, "c" : 1 }  
{ "_id" : ObjectId("50b26fb480a78af03b5163c9"), "a" : 2, "b" : 2, "c" : 1 }  
{ "_id" : ObjectId("50b26fbf80a78af03b5163ca"), "a" : 3, "b" : 3, "c" : 1 }  
{ "_id" : ObjectId("50b26fcd80a78af03b5163cb"), "a" : 3, "b" : 3, "c" : 2 }  
{ "_id" : ObjectId("50b26fd380a78af03b5163cc"), "a" : 3, "b" : 5, "c" : 3 }  
{ "_id" : ObjectId("50b27f7080a78af03b5163cd"), "a" : 3, "b" : 3, "c" : 2 }`

And the following aggregation query:

<pre><code>db.stuff.aggregate([{$group:
		     {_id:
		      {'moe':'$a', 
		       'larry':'$b',
		       'curly':'$c'
		      }
		     }
		    }])</code></pre>

How many documents will be in the result set?  
5.  Looking for unique values a, b, c   


##Using a document of _id
The `_id` key can be a document, as long as its unique.  

`db.foo.insert({_id: {name: "pokahFace", class: "m101"}, hometown: "OK"})`  


##Aggregation Expressions
Other expression that exists in the aggregation grouping stage of the pipeline:  
*$group*  
+ $sum -- count if you add everytime you see a key or if add value of key it can sum value of key
+ $avg -- average the value of the key across documents
+ $min -- find minimum value of the documents of a certain key
+ $max -- find maximum value of the documents of a certain key
+ $push -- builds arrays
+ $addtoset -- builds array (unique, add to array if not in array)
+ $first -- require to first sort and then return the first document in the list
+ $last -- require to first sort and then return the last document in the list

####Quiz
Which of the following aggregation expressions must be used in conjunction with a sort to make any sense?  

$first  
$last  


##Using $sum
**Lecture Notes**  
Write an aggregation expression that adds up  

Sum up the prices from each manufacturer charges.  
<code><pre>
{$group:
	{
		_id: { "maker": "$manufacturer" },
		sum_prices: {$sum: "$price"}
	}
}</code></pre>

####Quiz
This problem, and some after it, use the zips collection from media.mongodb.org/zips.json. You don't need to download it, but you can if you want, allowing you to test your queries within MongoDB. You can import, once downloaded, using mongoimport

Suppose we have a collection of populations by postal code. The postal codes in are in the _id field, and are therefore unique. Documents look like this:
<code><pre>
{
	"city" : "CLANTON",
	"loc" : [
		-86.642472,
		32.835532
	],
	"pop" : 13990,
	"state" : "AL",
	"_id" : "35045"
}</code></pre>

For students outside the United States, there are 50 non-overlapping states in the US with two letter abbreviations such as NY and CA. In addition, the capital of Washington is within an area designated the District of Columbia, and carries the abbreviation DC. For purposes of the mail, the postal service considers DC to be a "state." So in this dataset, there are 51 states. We call postal codes "zip codes." A city may overlap several zip codes.

Write an aggregation query to sum up the population (pop) by state and put the result in a field called population. Don't use a compound _id key (you don't need one and the quiz checker is not expecting one). The collection name is zips. so something along the lines of db.zips.aggregrate... 

**`db.zips.aggregate([{$group: {_id: "$state", population: {$sum: "$pop"}}}])`**


##Using $avg




##Using $addToSet
##Using $push
##Using $max and $min
##Double $group stages
##$project
##$match
##$sort
##$limit and $skip
##Revisiting $first and $last
$unwind
$unwind example
##Double $unwind
##Mapping between SQL and Aggregation
##Some Common SQL examples
##Limitations of the Aggregation Framework
