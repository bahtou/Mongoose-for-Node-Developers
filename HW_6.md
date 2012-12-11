
**HW 6.1**  
Which of the following statements are true about MongoDB replication. Check all that apply.

> * The minimum sensible number of voting nodes to a replica set is three.
* The oplog utilizes a capped collection.

**HW 6.2**  
Let's suppose you have a five member replica set and want to assure that writes are committed to the journal and are acknowledged by at least 3 nodes before you proceed forward. What would be the appropriate settings for w and j?

> w="majority", j=1

**HW 6.3**  
Which of the following statements are true about choosing and using a shard key:

> I got this WRONG!

HW 6.4
You have a sharded system with three shards and have sharded the collections "grades" in the "test" database across those shards. The output of sh.status() when connected to mongos looks like this:

<pre><code>
mongos> sh.status()
--- Sharding Status ---
  sharding version: { "_id" : 1, "version" : 3 }
  shards:
  {  "_id" : "s0",  "host" : "s0/localhost:37017,localhost:37018,localhost:37019" }
  {  "_id" : "s1",  "host" : "s1/localhost:47017,localhost:47018,localhost:47019" }
  {  "_id" : "s2",  "host" : "s2/localhost:57017,localhost:57018,localhost:57019" }
  databases:
  {  "_id" : "admin",  "partitioned" : false,  "primary" : "config" }
  {  "_id" : "test",  "partitioned" : true,  "primary" : "s0" }
    test.grades chunks:
        s1  4
        s0  4
        s2  4
      { "student_id" : { $minKey : 1 } } -->> { "student_id" : 0 } on : s1 Timestamp(12000, 0)
      { "student_id" : 0 } -->> { "student_id" : 2640 } on : s0 Timestamp(11000, 1)
      { "student_id" : 2640 } -->> { "student_id" : 91918 } on : s1 Timestamp(10000, 1)
      { "student_id" : 91918 } -->> { "student_id" : 176201 } on : s0 Timestamp(4000, 2)
      { "student_id" : 176201 } -->> { "student_id" : 256639 } on : s2 Timestamp(12000, 1)
      { "student_id" : 256639 } -->> { "student_id" : 344351 } on : s2 Timestamp(6000, 2)
      { "student_id" : 344351 } -->> { "student_id" : 424983 } on : s0 Timestamp(7000, 2)
      { "student_id" : 424983 } -->> { "student_id" : 509266 } on : s1 Timestamp(8000, 2)
      { "student_id" : 509266 } -->> { "student_id" : 596849 } on : s1 Timestamp(9000, 2)
      { "student_id" : 596849 } -->> { "student_id" : 772260 } on : s0 Timestamp(10000, 2)
      { "student_id" : 772260 } -->> { "student_id" : 945802 } on : s2 Timestamp(11000, 2)
      { "student_id" : 945802 } -->> { "student_id" : { $maxKey : 1 } } on : s2 Timestamp(11000, 3)
</code></pre>

If you ran the query

<pre><code>
use test
db.grades.find({'student_id':530289})
</code></pre>

Which shards would be involved in answering the query?

> s1

**HW 6.5**  
In this homework you will build a small replica set on your own computer. We will check that it works with `validate.py`, which you should download in `week6-lessons.tar` or `week6-lessons.zip`.

Create three directories for the three mongod processes. On unix, this could be done as follows:

`mkdir -p /data/rs1 /data/rs2 /data/rs3`

Now start three mongo instances as follows. Note that are three commands. The browser is probably wrapping them visually.

<pre><code>
./mongod --replSet m101 --logpath "1.log" --dbpath /data/rs1 --port 27017 --smallfiles --fork

./mongod --replSet m101 --logpath "2.log" --dbpath /data/rs2 --port 27018 --smallfiles --fork

./mongod --replSet m101 --logpath "3.log" --dbpath /data/rs3 --port 27019 --smallfiles --fork
</code></pre>

Now connect to a mongo shell and make sure it comes up

`./mongo --port 27017`

Now you will create the replica set. Type the following commands into the mongo shell:

<pre><code>
config = { _id: "m101", members:[
          { _id : 0, host : "localhost:27017"},
          { _id : 1, host : "localhost:27018"},
          { _id : 2, host : "localhost:27019"} ]
};
rs.initiate(config);
</code></pre>

At this point, the replica set should be coming up. You can type

`rs.status()`

to see the state of replication.

Now run `validate.py` to confirm that it works.

`python validate.py`

Validate connects to your local replica set and checks that it has three nodes. It has been tested under Pymongo 2.3 and 2.4. Type the validation code below.

> CongratsYouRock2012
