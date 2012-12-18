##Final: Question 1

>Please download the Enron email dataset enron.tar or enron.zip, untar or unzip it and then restore it using mongorestore. It should restore to a collection called "messages" in a database called "enron". Note that this is an abbreviated version of the full corpus. There should be 120,477 documents after restore.

>Inspect a few of the documents to get a basic understanding of the structure. Enron was an American corporation that engaged in a widespread accounting fraud and subsequently failed.

>In this dataset, each document is an email message. Like all Email messages, there is one sender but there can be multiple recipients.

>Construct a query to calculate the number of messages sent by Andrew Fastow, CFO, to Jeff Skilling, the president. Andrew Fastow's email addess was andrew.fastow@enron.com. Jeff Skilling's email was jeff.skilling@enron.com.

>For reference, the number of email messages from Andrew Fastow to John Lavorato (john.lavorato@enron.com) was 1. 

* 1
[* 3]
* 5
* 7
* 9
* 12

Final: Question 2

>Please use the Enron dataset you imported for the previous problem. For this question you will use the aggregation framework to figure out pairs of people that tend to communicate a lot.

>Turns out that the top channel is veronica.espinoza@enron.com to recipients@enron.com, with 2181 messages. But that is not very interesting, so your task is to figure out the second most popular pair of sender and recipient and indicate it below.

>Update: a few people have pointed out that a recipient sometimes appears more than once in the To header of a message. For our purposes, you can double count when that occurs. I did not consider it when designing the problem.

<pre><code>
   db.messages.aggregate({$unwind: "$headers.To"}, {$group: {_id: {"From": "$headers.F
rom", "To": "$headers.To"}, sumEmails: {$sum: 1}}}, {$sort: {sumEmails: -1}}, {$limit
: 10})
</code></pre>

1. susan.mara@enron.com to jeff.dasovich@enron.com
[1. susan.mara@enron.com to richard.shapiro@enron.com]
1. soblander@carrfut.com to soblander@carrfut.com
1. susan.mara@enron.com to james.steffes@enron.com
1. evelyn.metoyer@enron.com to kate.symes@enron.com
1. susan.mara@enron.com to alan.comnes@enron.com

##Final: Question 3

>In this problem you will update a document in the Enron dataset to illustrate your mastery of updating documents from the shell.

>Please add the email address "mrpotatohead@10gen.com" to the list of addresses in the "headers.To" array for the document with "headers.Message-ID" of "<8147308.1075851042335.JavaMail.evans@thyme>"

>After you have completed that task, please run final3-validate.py to get the validation code and put it in the box below without any extra spaces. The validation script assumes that it is connecting to a simple mongo instance on the standard port on localhost.

##Final: Question 4

>Enhancing the Blog to support viewers liking certain comments
In this problem, you will be enhancing the blog project to support users liking certain comments and the like counts showing up the in the permalink page.

>Start by downloading the code in final-problem4.tar or final-problem4.zip and loading up the blog dataset from last week. The user interface has already been implemented for you. It's not fancy. The /post URL shows the like counts next to each comment and displays a Like button that you can click on. That Like button POSTS to the /like URL on the blog, makes the necessary changes to the database state (you are implementing this), and then redirects the browser back to the permalink page.

>This full round trip and redisplay of the entire web page is not how you would implement liking in a modern web app, but it makes it easier for us to reason about, so we will go with it.

>Your job is to search the code for the string "XXX work here" and make the necessary changes. You can choose whatever schema you want, but you should note that the entry_template makes some assumptions about the how the like value will be encoded and if you go with a different convention than it assumes, you will need to make some adjustments.

>It is possible to solve this problem by putting NOTHING in one of the XXX spots and adding only a SINGLE LINE to the other spot to properly increment the like count. If you decide to use a different schema than the entry_template is expecting, then you will likely to work in both spots. The validation script does not look at the database. It looks at the blog.

>The validation script, final4-validate.py, will fetch your blog, go to the first post's permalink page and attempt to increment the vote count. You run it as follows:

````
python final4_validate.py
````

>Remember that the blog needs to be running as well as Mongo. The validation script takes some options if you want to run outside of localhost.

>After you have gotten it working, enter the validation string below.

##Final: Question 5

>Suppose your have a collection fubar with the following indexes created:

<pre><code>
[
  {
    "v" : 1,
    "key" : {
      "_id" : 1
    },
    "ns" : "test.fubar",
    "name" : "_id_"
  },
  {
    "v" : 1,
    "key" : {
      "a" : 1,
      "b" : 1
    },
    "ns" : "test.fubar",
    "name" : "a_1_b_1"
  },
  {
    "v" : 1,
    "key" : {
      "a" : 1,
      "c" : 1
    },
    "ns" : "test.fubar",
    "name" : "a_1_c_1"
  },
  {
    "v" : 1,
    "key" : {
      "c" : 1
    },
    "ns" : "test.fubar",
    "name" : "c_1"
  },
  {
    "v" : 1,
    "key" : {
      "a" : 1,
      "b" : 1,
      "c" : -1
    },
    "ns" : "test.fubar",
    "name" : "a_1_b_1_c_-1"
  }
]
</code></pre>
>Now suppose you want to run the following query against the collection.

`>db.fubar.find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})`

>Which of the following indexes could be used by MongoDB to assist in answering the query. Check all that apply. 

1. _id_
[1. a_1_b_1]
[1. a_1_c_1]
[1. c_1]
[1. a_1_b_1_c_-1]

##Final: Question 6

>Suppose you have a collection of students of the following form:

<pre><code>
{
  "_id" : ObjectId("50c598f582094fb5f92efb96"),
  "first_name" : "John",
  "last_name" : "Doe",
  "date_of_admission" : ISODate("2010-02-21T05:00:00Z"),
  "residence_hall" : "Fairweather",
  "has_car" : true,
  "student_id" : "2348023902",
  "current_classes" : [
    "His343",
    "Math234",
    "Phy123",
    "Art232"
  ]
}
</code></pre>

>Now suppose that basic inserts into the collection, which only include the last name, first name and student_id, are too slow. What could potentially improve the speed of inserts. Check all that apply. 

1. Add an index on last_name, first_name if one does not already exist.
[1. Set w=0, j=0 on writes]
[1. Remove all indexes from the collection]
1. Provide a hint to MongoDB that it should not use an index for the inserts
1. Build a replica set and insert data into the secondary nodes to free up the primary nodes.

##Final: Question 7

>You have been tasked to cleanup a photosharing database. The database consists of two collections, albums, and images. Every image is supposed to be in an album, but there are orphan images that appear in no album. Here are some example documents (not from the collections you will be downloading).

<pre><code>
> db.albums.findOne()
{
  "_id" : 67
  "images" : [
    4745,
    7651,
    15247,
    17517,
    17853,
    20529,
    22640,
    27299,
    27997,
    32930,
    35591,
    48969,
    52901,
    57320,
    96342,
    99705
  ]
}
</code></pre>

> db.images.findOne()
{ "_id" : 99705, "height" : 480, "width" : 640 }

From the above, you can conclude that the image with _id = 99705 is in album 67. It is not an orphan.

Your task is to write a program to remove every image from the images collection that appears in no album. Or put another way, if an image does not appear in at least one album, it's an orphan and should be removed from the images collection.

Start by using mongoimport to import your albums.json and images.json collections. (Did you notice the links in the previous sentence?)
When you are done removing the orphan images from the collection, there should be 90,038 documents in the images collection. To prove you did it correctly, what is the sum of the _id fields from the images collection (you can get this by writing an aggregation query). 

* 4499664322
* 4499664874
* 4427664274
* 3499619274
[* 4499664274]

##Final: Question 8

>Suppose you have a three node replica set. Node 1 is the primary. Node 2 is a secondary, Node 3 is a secondary running with a delay of 10 seconds. All writes to the database are issued with w=majority and j=1 (by which we mean that the getLastError call has those values set).

>A write operation (could be insert or update) is initiated from your application at time=0. At time=5 seconds, the primary, Node 1, goes down for an hour and another node is elected primary.

>Will there be a rollback of data when Node 1 comes back up? Choose the best answer.

* Yes, always
* No, never
* Maybe, it depends on whether Node 3 has processed the write
[* Maybe, it depends only on whether Node 2 has processed the write. ]

##Final: Question 9

>Imagine an electronic medical record database designed to hold the medical records of every individual in the United States. Because each person has more than 16MB of medical history and records, it's not feasible to have a single document for every patient. Instead, there is a patient collection that contains basic information on each person and maps the person to a patient_id, and a record collection that contains one document for each test or procedure. One patient may have dozens or even hundreds of documents in the record collection.

>We need to decide on a shard key to shard the record collection. What's the best shard key for the record collection, provided that we are willing to run scatter gather operations to do research and run studies on various diseases and cohorts? That is, think mostly about the operational aspects of such a system.

[* patient_id]
* _id  
* primary care physican (your principal doctor)
* date and time when medical record was created
* patient first name  
* patient last name  


##Final: Question 10

>Understanding the output of explain
We perform the following query on the enron dataset:

<pre><code>
db.messages.find({'headers.Date':{'$gt': new Date(2001,3,1)}},{'headers.From':1, _id:0}).sort({'headers.From':1}).explain()
</code></pre>

and get the following explain output.

<pre><code>
{
  "cursor" : "BtreeCursor headers.From_1",
  "isMultiKey" : false,
  "n" : 83057,
  "nscannedObjects" : 120477,
  "nscanned" : 120477,
  "nscannedObjectsAllPlans" : 120581,
  "nscannedAllPlans" : 120581,
  "scanAndOrder" : false,
  "indexOnly" : false,
  "nYields" : 0,
  "nChunkSkips" : 0,
  "millis" : 250,
  "indexBounds" : {
    "headers.From" : [
      [
        {
          "$minElement" : 1
        },
        {
          "$maxElement" : 1
        }
      ]
    ]
  },
  "server" : "Andrews-iMac.local:27017"
}
</code></pre>
Check below all the statements that are true about the way MongoDB handled this query. 

[>The query did not utilize an index to figure out which documents match the find criteria.]

[>The query used an index for the sorting phase.]

>The query returned 120,477 documents

[>The query performed a full collection scan]
