Week 5 class notes
==================

----

##Simple Aggregation Example
`db.products.aggregate([ {$group: { _id: "$manufacturer", num_products: {$sum: 1} }}])`

Returns a document (can't be greater than 16MB)

<pre><code>
{ "result": [
			{
				"_id": "Google",
				"num_products": 1
			},
			{
				"_id": "Amazon",
				"num_products": 2
			},
			{
				...
			}
			]
}
</code></pre>

####Quiz
> Write the aggregation query that will find the number of products by category of a collection that has the form:

<pre><code>
{
	"_id" : ObjectId("50b1aa983b3d0043b51b2c52"),
	"name" : "Nexus 7",
	"category" : "Tablets",
	"manufacturer" : "Google",
	"price" : 199
}
</code></pre>

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
>Which of the following are stages in the aggregation pipeline?
**Match, Group, Skip, Limit, Sort, Project, Unwind**


##Simple Example Expanded
Walkthough on how `aggregation()` works.

####Quiz
>If you have the following collection of stuff:

<pre><code>
db.stuff.find()
{ "_id" : ObjectId("50b26f9d80a78af03b5163c8"), "a" : 1, "b" : 1, "c" : 1 }
{ "_id" : ObjectId("50b26fb480a78af03b5163c9"), "a" : 2, "b" : 2, "c" : 1 }
{ "_id" : ObjectId("50b26fbf80a78af03b5163ca"), "a" : 3, "b" : 3, "c" : 1 }
{ "_id" : ObjectId("50b26fcd80a78af03b5163cb"), "a" : 3, "b" : 3, "c" : 2 }
{ "_id" : ObjectId("50b26fd380a78af03b5163cc"), "a" : 3, "b" : 5, "c" : 3 }`
</code></pre>

>and you perform the following aggregation:

<pre><code>
`db.stuff.aggregate([{$group:{_id:'$c'}}])`
</code></pre>

>How many documents will be in the result set from aggregate?
**3 documents because there are 3 unique values of 'c'**


##Compound Grouping
Group by multiple keys
From the SQL world:
'select manufacturer, category, count(*) from products group by manufacturer, category'

In mongo:
`$group: {_id: {manufacturer: "$manufacturer", category: "$category"}}`

The keys can be named anything.  Here they are 'manufacturer' and 'category'.

Can add any number of keys.

####Quiz
>Given the following collection:

<pre><code>
db.stuff.find()
{ "_id" : ObjectId("50b26f9d80a78af03b5163c8"), "a" : 1, "b" : 1, "c" : 1 }
{ "_id" : ObjectId("50b26fb480a78af03b5163c9"), "a" : 2, "b" : 2, "c" : 1 }
{ "_id" : ObjectId("50b26fbf80a78af03b5163ca"), "a" : 3, "b" : 3, "c" : 1 }
{ "_id" : ObjectId("50b26fcd80a78af03b5163cb"), "a" : 3, "b" : 3, "c" : 2 }
{ "_id" : ObjectId("50b26fd380a78af03b5163cc"), "a" : 3, "b" : 5, "c" : 3 }
{ "_id" : ObjectId("50b27f7080a78af03b5163cd"), "a" : 3, "b" : 3, "c" : 2 }
</code></pre>

>And the following aggregation query:

<pre><code>
db.stuff.aggregate([{$group:
		     {_id:
		      {'moe':'$a',
		       'larry':'$b',
		       'curly':'$c'
		      }
		     }
		    }])
</code></pre>

>How many documents will be in the result set?
**5.  Looking for unique values a, b, c**


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
>Which of the following aggregation expressions must be used in conjunction with a sort to make any sense?
**$first
$last**


##Using $sum
**Lecture Notes**
Write an aggregation expression that adds up

Sum up the prices from each manufacturer charges.
<pre><code>
{$group:
	{
		_id: { "maker": "$manufacturer" },
		sum_prices: {$sum: "$price"}
	}
}</code></pre>

####Quiz
>This problem, and some after it, use the zips collection from media.mongodb.org/zips.json. You don't need to download it, but you can if you want, allowing you to test your queries within MongoDB. You can import, once downloaded, using mongoimport

>Suppose we have a collection of populations by postal code. The postal codes in are in the _id field, and are therefore unique. Documents look like this:

<pre><code>
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

>For students outside the United States, there are 50 non-overlapping states in the US with two letter abbreviations such as NY and CA. In addition, the capital of Washington is within an area designated the District of Columbia, and carries the abbreviation DC. For purposes of the mail, the postal service considers DC to be a "state." So in this dataset, there are 51 states. We call postal codes "zip codes." A city may overlap several zip codes.

>Write an aggregation query to sum up the population (pop) by state and put the result in a field called population. Don't use a compound _id key (you don't need one and the quiz checker is not expecting one). The collection name is zips. so something along the lines of db.zips.aggregrate...

**`db.zips.aggregate([{$group: {_id: "$state", population: {$sum: "$pop"}}}])`**


##Using $avg
<pre><code>
db.products.aggregate([
	{$group:
		{
			_id: {
					"category": "$category"
			},
			avg_price: {$avg: "$price"}
		}
	}
])
</code></pre>

####Quiz
>This problem uses the same dataset as we described in using $sum quiz and you should review that quiz if you did not complete it.

>Given population data by zip code (postal code) that looks like this:

<pre><code>
{
	"city" : "FISHERS ISLAND",
	"loc" : [
		-72.017834,
		41.263934
	],
	"pop" : 329,
	"state" : "NY",
	"_id" : "06390"
}
</code></pre>

>Write an aggregation expression to calculate the average population of a zip code (postal code) **by state**. As before, the postal code is in the _id field and is unique. The collection is assumed to be called "zips" and you should name the key in the result set "average_pop".
**db.zips.aggregate([{$group: {_id: "$state", avarage_pop: {$avg: "$pop"}}}])**


##Using $addToSet
No direct parallel from the world of SQL

An example,
trying to figure out which products each manufacturer sells.
Group by manufactures.
For each manufacture we want to create a new array of categories they sell in.

<pre><code>
db.products.aggregate([{
		$group: {
			_id: {
				"maker" : "$manufacturer"
			},
			categories: {$addToSet: "$category"}
		}
}])
</code></pre>

####Quiz
>This problem uses the same zip code data as the $using sum quiz. See that quiz for a longer explanation.

>Suppose we population by zip code (postal code) data that looks like this (putting in a query for the zip codes in Palo Alto)

<pre><code>
db.zips.find({state:"CA",city:"PALO ALTO"})
{ "city" : "PALO ALTO", "loc" : [ -122.149685, 37.444324 ], "pop" : 15965, "state" : "CA", "_id" : "94301" }
{ "city" : "PALO ALTO", "loc" : [ -122.184234, 37.433424 ], "pop" : 1835, "state" : "CA", "_id" : "94304" }
{ "city" : "PALO ALTO", "loc" : [ -122.127375, 37.418009 ], "pop" : 24309, "state" : "CA", "_id" : "94306" }
</code></pre>

>Write an aggregation query that will return the postal codes that cover each city. The results should look like this:

<pre><code>
		{
			"_id" : "CENTREVILLE",
			"postal_codes" : [
				"22020",
				"49032",
				"39631",
				"21617",
				"35042"
			]
		},
</code></pre>

>Again the collection will be called zips. You can deduce what your result column names should be from the above output. (ignore the issue that a city may have the same name in two different states and is in fact two different cities in that case - for eg Springfield, MO and Springfield, MA)
**db.zips.aggregate([{$group: {_id: "$city", postal_codes: {$addToSet: "$_id"}}}])**


##Using $push
Doesn't guarantee that each element is in the set only once.
Does not check if it is in the set or not.

What categories each manufacturer had products in?

<pre><code>
db.products.aggregate([{
		$group: {
			_id: { maker: "$manufacturer"},
			categories: {$push: "$category"}
		}
}])
</code></pre>

####Quiz
>Given the zipcode dataset (explained more fully in the using $sum quiz) that has documents that look like this:

<pre><code>
db.zips.findOne()
{
	"city" : "ACMAR",
	"loc" : [
		-86.51557,
		33.584132
	],
	"pop" : 6055,
	"state" : "AL",
	"_id" : "35004"
}
</code></pre>

>would you expect the following two queries to produce the same result or different results?

<pre><code>
db.zips.aggregate([{"$group":{"_id":"$city", "postal_codes":{"$push":"$_id"}}}])
db.zips.aggregate([{"$group":{"_id":"$city", "postal_codes":{"$addToSet":"$_id"}}}])
</code></pre>

>**Same result because `_id` is unique in the collection.**


##Using $max and $min
>Suppose we want to find the max price of product from a manufacturer.

<pre><code>
db.products.aggregate([{
	$group: {
		_id: {maker: "$manufacturer"},
		maxprice: {$max: "$price"}
	}
}])
</code></pre>

Limiting because you can't find the name of the product with the max price.

####Quiz
>Again thinking about the zip code database, write an aggregation query that will return the population of the postal code in each state with the highest population. It should return output that looks like this:

<pre><code>
{
			"_id" : "WI",
			"pop" : 57187
		},
		{
			"_id" : "WV",
			"pop" : 70185
		},
..and so on
</code></pre>

>Once again, the collection is named zips.
**`db.zips.aggregate([{$group: { _id: "$state", pop: {$max: "$pop"}}}])`**


##Double `$group` stages
Can group twice in the aggregate staging.

What is the average class grade for each class?

* First, average all student grades within the class
* Then average those grades grouped by `_id.class_id`

<pre><code>
db.grades.aggregate([{
	$group : {
		_id: {class_id: "$class_id",
			  student_id: "$student_id"},
		average: {$avg: "$score"}
	},
	$group: {
		_id: "$_id.class_id",
		average: {$avg: "$average"}
	}
}])
</code></pre>


####Quiz
>Given the following collection:

<pre><code>db.fun.find()
{ "_id" : 0, "a" : 0, "b" : 0, "c" : 21 }
{ "_id" : 1, "a" : 0, "b" : 0, "c" : 54 }
{ "_id" : 2, "a" : 0, "b" : 1, "c" : 52 }
{ "_id" : 3, "a" : 0, "b" : 1, "c" : 17 }
{ "_id" : 4, "a" : 1, "b" : 0, "c" : 22 }
{ "_id" : 5, "a" : 1, "b" : 0, "c" : 5 }
{ "_id" : 6, "a" : 1, "b" : 1, "c" : 87 }
{ "_id" : 7, "a" : 1, "b" : 1, "c" : 97 }
</code></pre>

>And the following aggregation query

<pre><code>
db.fun.aggregate([{$group:{_id:{a:"$a", b:"$b"}, c:{$max:"$c"}}}, {$group:{_id:"$_id.a", c:{$min:"$c"}}}])
</code></pre>

>What values are returned?
**52 and 22**


##$project
Lets you reshape the documents that come into the pipeline [1:1]:

* remove keys
* add new keys
* reshape keys
* use some functions such as:
	* $toUpper
	* $toLower
	* $add
	* $multiply

Do not include `_id` field.
Then create a lower case field of `manufacturer`.

<pre><code>
db.products.aggregate([{
	$project: {
		_id: 0,
		maker: {$toLower: "$manufacturer"},
		details: {category: "$category".
				  price: {$multiply: [$price, 10]}
				},
		item: "$name"
	}
}])
</code></pre>

You want to project to clean up the document, cherry pick certain keys out of the documents (save memory -- filter before sending to grouping stage).

####Quiz
>Write an aggregation query with a single projection stage that will transform the documents in the zips collection from this:

<pre><code>
{
	"city" : "ACMAR",
	"loc" : [
		-86.51557,
		33.584132
	],
	"pop" : 6055,
	"state" : "AL",
	"_id" : "35004"
}
</code></pre>

> to documents in the result set that look like this:

<pre><code>
{
	"city" : "acmar",
	"pop" : 6055,
	"state" : "AL",
	"zip" : "35004"
}
</code></pre>

>So that the checker works properly, please specify what you want to do with the _id key as the first item. The other items should be ordered as above. As before, assume the collection is called zips. You are running only the projection part of the pipeline for this quiz.

>A few facts not mentioned in the lesson that you will need to know to get this right: If you don't mention a key, it is not included, except for _id, which must be explicitly suppressed. If you want to include a key exactly as it is named in the source document, you just write key:1, where key is the name of the key. You will probably get more out of this quiz is you download the zips.json file and practice in the shell. zips.json link is in the using $sum quiz

<pre><code>
db.zips.aggregate([{
	$project: {
		_id: 0,
		city: {$toLower: "$city"},
		pop: "$pop",
		state: "$state",
		zip: "$_id"
	}
}])
</code></pre>

>OR

<pre><code>
db.zips.aggregate([{
	"$project": {
		"_id": 0,
		"city": {$toLower: "$city"},
		pop: 1,
		state: 1,
		zip: "$_id"
	}
}])
</code></pre>


##$match
Filters the documents -- reducing effect [n:1]
Reasons to `$match` is to filter results and only aggregate a portion of the documents.  Or search for particular parts of the result set after the grouping.

Suppose you only want to aggregate documents on a particular state.

<pre><code>
db.zips.aggregate([
	{ $match: {
		state: "NY"
		}
	},
	{ $group: {
		_id: "$city",
		population: {$sum: "$pop"},
		zip_codes: {$addToSet: "$_id"}
		}
	},
	{ $project: {
		_id: 0,
		city: "$_id",
		population: 1,
		zip_codes: 1
		}
	}
])
</code></pre>

*Order of output is not necessarily preserved*

###Quiz
>Again, thinking about the zipcode collection, write an aggregation query with a single match phase that filters for zipcodes with greater than 100,000 people. You may need to look up the use of the $gt operator in the MongoDB docs.

>Assume the collection is called zips.

<pre><code>
db.zips.aggregate([
	{ $match: {
		pop: {$gt: 100000}
		}
	}
])
</code></pre>


##$sort
Can be a memory hog.
Aggregation framework does not go to disk for sorting.
Before `$grouping` and after a `$match`, sort can use an **index**.
If it's after `$grouping` it cannot use an **index**.

* Can be applied before or after group stage
* Sort multiple times
* Really useful

Sorting before a grouping is very useful.

Looking at sort at the end of the pipeline:

<pre><code>
 db.zips.aggregate([
	{ $match:
		{
			state: "NY"
		}
	},
	{ $group:
		{
			_id: "$city",
			population: {$sum: "$pop"}
		}
	},
	{ $project:
		{
			_id: 0,
			city: "$_id",
			population: 1
		}
	},
	{ $sort:
		{
			population: -1
		}
	}
])
</code></pre>

####Quiz
>Again, considering the zipcode collection, which has documents that look like this,

<pre><code>
{
	"city" : "ACMAR",
	"loc" : [
		-86.51557,
		33.584132
	],
	"pop" : 6055,
	"state" : "AL",
	"_id" : "35004"
}
</code></pre>

>Write an aggregation query with just a sort stage to sort by (state, city), both ascending. Assume the collection is called zips.

<pre><code>
db.zips.aggregate([
	{ $sort:
		{
			state: 1,
			city: 1
		}
	}
])
</code></pre>


##$limit and $skip
*  First you must `$sort`
*  Then `$skip` and `$limit` (in that order or else nothing is returned)

<pre><code>
db.zips.aggregate([
	{$match:
		{
			state: "NY"
		}
	},
	{$group:
		{
			_id: "$city",
			population: {$sum: "$pop"}
		}	
	},
	{$project:
		{
			_id: 0,
			city: "$_id",
			population: 1
		}	
	},
	{$sort:
		{
			population: -1
		}
	},
	{$skip: 10},
	{$limit: 5}
])
</code></pre>

####Quiz
>Suppose you change the order of skip and limit in the query shown in the lesson, to look like this:

<pre><code>
db.zips.aggregate([
    {$match:
     {
	 state:"NY"
     }
    },
    {$group:
     {
	 _id: "$city",
	 population: {$sum:"$pop"},
     }
    },
    {$project:
     {
	 _id: 0,
	 city: "$_id",
	 population: 1,
     }
    },
    {$sort:
     {
	 population:-1
     }
    },
    {$limit: 5},
    {$skip: 10} 
])
</code></pre>

>How many documents do you think will be in the result set? 
**0zero (see above)**


##Revisiting $first and $last
Group operators  
Allow you to get the first and last documents in the group of documents  

<pre><code>
db.zips.aggregate([
	{$group:
		{
			_id: {state: "$state", city: "$city"},
			population: {$sum: "$pop"}
		}
	},
	/*sort by state, population*/
	{$sort:
		{_id.state: 1, population: -1}		
	},
	/*group by state, get the first item in each group*/
	{$group:
		{
			_id: "$_id.state",
			city: {$first: "$_id.city"},
			population: {$first: "$population"}
		}
	},
	/*now sort by state again*/
	{$sort:
		{_id: 1}
	}
])
</code></pre>

####Quiz
>Given the following collection:

<pre><code>
db.fun.find()
{ "_id" : 0, "a" : 0, "b" : 0, "c" : 21 }
{ "_id" : 1, "a" : 0, "b" : 0, "c" : 54 }
{ "_id" : 2, "a" : 0, "b" : 1, "c" : 52 }
{ "_id" : 3, "a" : 0, "b" : 1, "c" : 17 }
{ "_id" : 4, "a" : 1, "b" : 0, "c" : 22 }
{ "_id" : 5, "a" : 1, "b" : 0, "c" : 5 }
{ "_id" : 6, "a" : 1, "b" : 1, "c" : 87 }
{ "_id" : 7, "a" : 1, "b" : 1, "c" : 97 }
</code></pre>

>What would be the value of c in the result from this aggregation query

<pre><code>
db.fun.aggregate([
    {$match:{a:0}},
    {$sort:{c:-1}}, 
    {$group:{_id:"$a", c:{$first:"$c"}}}
])

<b>answer: 54</b>
</code></pre>


##$unwind
Dealing with arrays in documents.  
Document with an array is 'pre-joined' data.  
Use `$unwind` to unjoin the data and then rejoin it in a way that we can do grouping calculations.  

For example,  
`{a: 1, b: 2, c: ['apple', 'pear', orange]}`  
apply **`$unwind`**  
{a: 1, b: 2, c: 'apple'}  
{a: 1, b: 2, c: 'pear'}  
{a: 1, b: 2, c: 'orange'}  

There is a data explosion from the unwind.  
If you have 5 documents and 3 elements inside an array, then you get 15 new documents.  

####Quiz
>Suppose you have the following collection:

<pre><code>
db.people.find()
{ "_id" : "Barack Obama", "likes" : [ "social justice", "health care", "taxes" ] }
{ "_id" : "Mitt Romney", "likes" : [ "a balanced budget", "corporations", "binders full of women" ] }
</code></pre>

>And you unwind the "likes" array of each document. How many documents will you wind up with?
**6**


##$unwind example
Take the blog posts example.  
There is an array called `tags` that has string elements.  
We want to count how many times does a particular element in the `tags` appears throughout the post (posts per tag).  

Unwind the tags, group by tags and then count.  

<pre><code>
db.posts.aggregate([
	/*unwind by tags*/
	{$unwind: "$tags"},
	/*now group by tags, counting each tag*/
	{$group:
		{
			_id: "$tags",
			count: {$sum: 1} 
		}
	},
	/*sort by popularity*/
	{$sort: {count: -1}},
	{$limit: 10},
	{$project: 
		{
			_id: 0,
			tag: "$_id",
			count: 1
		}
	}
])
</code></pre>

###Quiz
>Which grouping operator will enable to you to reverse the effects of an unwind?  
**$push**
**`$addToSet` might also work if the array was unique.**


##Double $unwind
More than one array in a document?  Then double unwind!  

<pre><code>
db.inventory.aggregate([
	{$unwind: "$sizes"},
	{$unwind: "$colors"},
	{$group:
		{
			_id: {size: "$sizes", color: "$color"},
			count: {$sum: 1}
		}
	}
])
</code></pre>

####Quiz
>Can you reverse the effects of a double unwind (2 unwinds in a row) in our inventory collection (shown in the lesson ) with the `$push` operator  
**yes** with two pushes in a row  

<pre><code>
db.inventory.aggregate([
	{$unwind: "$sizes"},
	{$unwind: "$colors"},
	{$group:
		{
			_id: {name: "$name", size: "$sizes"},
			colors: {$push: "$colors"}
		}
	},
	{$group:
		{
			_id: {name: "$_id.name", colors: "$colors"},
			sizes: {$push: "$_id.size"}
		}
	},
	{$project:
		{
			_id: 0,
			name: "$_id.name",
			sizes: 1,
			colors: "$_id.colors"
		}
	}
])
</code></pre>

>Using the `$addToSet` (unique elements in arrary)

<pre><code>
db.inventory.aggregate([
	{$unwind: "$sizes"},
	{$unwind: "$colors"},
	{$group:
		{
			_id: "$name",
			sizes: {$addToSet: "$sizes"},
			colors: {$addToSet: "$colors"}
		}
	}
])
</code></pre>

##Mapping between SQL and Aggregation

SQL to MONGO

<table>
	<tr>
		<th>SQL</th>
		<th>MONGO</th>
	</tr>
	<tr>
		<td>WHERE</td>
		<td align='center'>$match</td>
	</tr>
	<tr>
		<td>GROUP BY</td>
		<td align='center'>$group</td>
	</tr>
	<tr>
		<td>HAVING</td>
		<td align='center'>$match</td>
	</tr>
	<tr>
		<td>SELECT</td>
		<td align='center'>$project</td>
	</tr>
	<tr>
		<td>ORDER BY</td>
		<td align='center'>$sort</td>
	</tr>
	<tr>
		<td>LIMIT</td>
		<td align='center'>$limit</td>
	</tr>
	<tr>
		<td>SUM()</td>
		<td align='center'>$sum</td>
	</tr>
	<tr>
		<td>COUNT()</td>
		<td align='center'>$sum</td>
	</tr>
	<tr>
		<td>join</td>
		<td align='center'>no such equivalent but similar to $unwind</td>
	</tr>
</table>


##Some Common SQL examples
Look at the [mongodb](http://docs.mongodb.org/manual/reference/sql-aggregation-comparison/) site  
Also helpful, [SQL to Mongodb Mapping](http://docs.mongodb.org/manual/reference/sql-comparison/)


##Limitations of the Aggregation Framework
* result sets are limited to 16MB of memery
* cannot use more than 10% of the memory on a machine
* sharding

In a sharding an environment, collections are split between multiple mongo instances.  
Instead of sending your processes to 'mongod', you send them to a 'mongos' (router).  

Using the aggregate framework, the first `$group` or the first `$sort` stage the aggregation has to be brought back to 'mongos'.  

Alternative to aggregation framework:
* mapReduce
* hadoop (there is a hadoop connector in mongoDB)