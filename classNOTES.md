Week 3 class notes
-----------------

###Application-Driven Schema  
Modularize the data

*  what pieces of data are read only
*  what pieces of data are write only
*  what pieces of data are used together

Model the data access patterns of the applications

**Basic facts:  MongoDB supports**

*  rich Documents
*  pre join/embed data
*  no mongo joins (do in the application itself)
*  no constraints
*  atomic operations (no transactions)
*  no declared schema (good to have one before hand)

The single most import factor in designing your application schema within mongoDB is matching the data access patterns of your application.

**Goals of Normalization in relational tables**

1.  free the db of modification anomalies
2.  minimize redesign when extending db
3.  avoid bias toward any particular access pattern

In MongoDB we will not abide by the third.  
Avoid embedding documents that generate anomalies (inconsistent data changes)  

###PostSchema  
<table>
  <tr>
    <td>_id:</td><td>ObjectId()</td>
  </tr>
  <tr>
    <td>author:</td><td>String</td>
  </tr>
  <tr>
    <td>body:</td><td>String</td>
  </tr>
  <tr>
    <td>title:</td><td>String</td>
  </tr>
  <tr>
    <td>comments:</td><td>[array document]</td>
  </tr>
  <tr>
    <td>date:</td><td>Date</td>
  </tr>
  <tr>
    <td>permalink:</td><td>String</td>
  </tr>
  <tr>
    <td>tags:</td><td>[array document]</td>
  </tr>
</table>

Providing a table of contents by tag is not well supported data access pattern by the blog schema (aggregation framework).  

**Alternative Blog Schema**

Post, Comments and Tag documents.  
Because there is no joins in MongoDB this leads the user to manually join the data by calling the documents and read them into memory. No locality of data.  

If you design taking the relational approach you will have a hard time.  Embed data when you can, preJoin it when you can.  

###Living without Constraints

Relational DBs are great keeping the DB consistent using foreign keys.  
How do you live in a world without foreign key constraint?  
Embedding data.  Pre-joining data.  

###Living without Transaction

Transactions offer ACID.  
MongoDB does offer Atomic Operations.

*  When work on a single document, work will be completed before anyone sees (all changes seen or no changes)
*  Update whole document at once

**Approaches to take to overcome lack of transactions**

1.  Restructure code to be working on a single document
2.  Implement locking in software
3.  Tolerate inconsistency

###1:1 Relations

IFF each item corresponds to one other item  

Frequency of access:  
-- access employee info but rarely resume.  

Size of items (16MB):  
-- update documents  

Atomicity of data:  
-- Cannot stand any inconsistency, update employee and resume all at once  

Two documents are related to each other 1:1.  
Whats a good reason to keep them in separate collections?

*  To reduce the working set size of your application
*  The combined size of the documents would be larger than 16MB

###1:N Relations

Many entities map to one entity (people in a city).  

True linking:  
- people collection
--- name  
--- city  
- city collections  
--- _id  
Link city to _id.  

One to Few:  
Blog post to comments
- post collection
--- name  
--- comments  
Single collection that is embedded.  

###N:N Relations

Book can have many authors  
Students can have many teachers  

Practically speaking, Few-to-Few.  
Each book has a few authors, and authors have few books.  
Note access patterns.  

###Multikey Indexes

Link teachers with students by embedding an array of teachers in the student collection.  
`ensureIndex`

###Benefits of Embedding data

*  Improve read performaces
*  One round trip to the DB

Comes down to application access patterns.  

###Trees

How to represent a tree inside a database?  
Embedding ancestors in collection.  

###When to Denormalize

If we don't duplicate data we don't expose ourselves to modification anomalies.  
Embedding avoids these anomalies.  
1:N (embed from many to one).  
N:N (Link through array of object ids)

###Handling Blobs

GRID FS that will break up a large file into chunks and store these chunks in collections and store meta-data in another collections.  
A collection that tells you about the chunks and then the chunks are stored in MongoDB.  

See `using_gridfs.py`
