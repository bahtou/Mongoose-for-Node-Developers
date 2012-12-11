Week 6 class notes
==================

----

#Application Engineering

##Introduction
Replication and Sharding

Replication is a technique for introducing the degree of fault tolerance.
Asynchronously replicating your data amongst multiple nodes.
As a developer a replicating environment is a useful technqiue.

Sharding is the way to scale out in mongo.  Split collection into multiple instances.
As a developer understanding sharding environments is important.
Create a shard key and know how to query a sharding environment.


##Write Concern
* Durability of write
* Availability / Fault tolerance
* Horizontal Scalability

**Durability of write**
"Fire and forget" -- if you want to know if the db got your 'write' command and that no errors were thrown, then issue a `get last` error call.

Inside the application / drivers the user decides if they want to get a `get last error` call.

Two parameters inside the `get last error` call.

1.  The `w` parameter
2.  The `j` parameter

The `w` parameter determines whether or not you are going to wait for the write to be acknowledge.
A `w=1` waits for the write to be acknowledge.

The `j` (journal) [1 or true] 'get last error' will wait until the journal commits to disk.
A journal is a log on the disk that has a list of operations being performed on the data.
And once committed, even with power lost or what have you, you can replay the operations and they will apply to the data itself.

Once commited to journal and assume the disk is persistent, then it is a persistent write.
You can say that you want to wait on every single write for the journal to complete and we want to wait for it to be acknowledged.

<table>
  <tr>
    <th>w</th>
    <th>j</th>
    <th>state</th>
  </tr>
  <tr>
    <td>0</td>
    <td>0</td>
    <td align="center">fire and forget</td>
  </tr>
  <tr>
    <td>1</td>
    <td>0</td>
    <td align="center">wait for acknowledgment (err: primary key constraint, etc are returned)</td>
  </tr>
  <tr>
    <td>1</td>
    <td>1</td>
    <td align="center">wait for write to commit to journal with acknowledgment</td>
  </tr>
  <tr>
    <td>0</td>
    <td>1</td>
    <td align="center">wait for write to commit to journal without acknowledgment</td>
  </tr>
</table>

The parameters `(w, j)` are called the "Write Concern" -- How concern are you that your writes are completed before you get a response back?

This "Write Concern" is handled by the drivers.
`safemode = true` is the equivalent of (w, j) = (1, 0)

####Quiz
Provided you assume that the disk is persistent, what are the w and j settings required to guarantee that an insert or update has been written all the way to disk.

```w=1, j=1
```

##Network Errors
Even though you use `w=1, j=1` to gain confidence in your writes, you must take into account network errors.

Suppose that your application issues an insert with `(1, 1)` and the write did complete but before it completed the network connection got reseted.  In this case, you don't know if your write completed or not.

There is always a degree of uncertainty in any network based application.

####Quiz
What are the reasons why an application may receive an error back even if the write was successful. Check all that apply.

>The network TCP network connection between the application and the server was reset between the time of the write and the time of the getLastError call.
The MongoDB server terminates between the write and the getLastError call.
The network fails between the time of the write and the time of the getLastError call.


##The Pymongo Driver
[Mongo API drivers](api.mongodb.org)

Example of using the updated version of the python mongo driver:

<pre><code>
  import pymongo

  c = pymongo.MOngoCLient(host="mongodb://localhost:27017", w=2, j=True)

  db = c.m101
  people = db.people

  print "inserting"
  people.insert({"name": "Tommy Glue", "favorite_color": "greenish-it"})
  ...
</code></pre>

A new mongoClient connection class has been rolled out.

####Quiz
In the 2.4 release of Pymongo, a new connection class is introduced that automatically sets w=1, j=0. It essentially defaults to what used to be called safe mode and replaces the old Connection class. What is the name of that class?

>MongoClient


##Introduction to Replication
We talked about how to get *durability* on a single node by waiting for the write to go to the log.  But how do you get availability and fault tolerance?

 Replica set is a set of mongo nodes that act together and mirror each other in terms of the data.
 There is one primary and the other nodes are secondary (but thats dynamics).
 Data written to the primary will ascyn replicate to the secondaries.

 Applications and their drivers will connect to the primary (can only write to the primary).  If the primary goes does, the remaining nodes will 'elect' a new node to replace the primary.  Then your app/drivers will connect to the new primary.

The node that went down can then come back on as a secondary.

Minimum number of nodes is 3three.

####Quiz
What is the minimum original number of nodes needed to assure the election of a new Primary if a node goes down?

>3three


##Replica Set Elections
*Types of Replica Set Nodes*

* Regular
* Arbiter -- voting purposes (has no data on it)
* Delayed/Regular -- disaster recovery node (cannot become primary node [priority=0])
* Hidden -- cannot be primary, used for analytics [priority=0]

####Quiz
Which types of nodes can participate in elections of a new primary?
> Regular replica set members, hidden members and arbiters


##Write Consistency
Only a single primary db at any single time.
In the default configuration your writes and reads go to the primary.
Reads don't have to go to the primary.

But if you allow reads/writes to go to the primary then you get strong consistency with read w/r to writes (you won't read stale data--if your write it you can read it).

If you allow reads to go to your secondary then you can get stale data.  The lag between any two nodes cannot be guaranteed because the asyn nature.

Read preferences -- reads from the secondary so as to scale their replica sets (yes/no?).

When failover occurs, the primary is knocked down and writes cannot be completed.

Eventual consistency ( a weaker form of consistency) -- eventually you will be able to read what you wrote but no guarantee that you'll be able to read it in a particular time frame.

By reading to the secondaries you get 'eventual consistency', but not from the primary.

####Quiz
During the time when failover is occurring, can writes successfully complete?
> NO


##Creating a Replica Set

####Quiz
Which command, when issued from the mongo shell, will allow you to read from a secondary?

>rs.slaveOk()


##Replica Set Internals

####Quiz
In the video how long did it take to elect a new primary?

> about three seconds


##Failover and Rollback
Suppose there are three nodes and the primary goes down.
One of the two secondary nodes will be elected as primary.
But there were writes on the primary that the secondary nodes don't have.

The new primary comes up but does not have the writes.
After some time the old primary comes back as a secondary.
The new secondary will sync with the new primary and realize that it has writes that the new primary does not have.

The new secondary will then rollback those writes and dump them into a file.
A user can put those writes in but on its own they will not be part of the db.

To avoid the failover-rollback, wait for the majority of the dbs so have the write (w=1, j=1).

####Quiz
What happens if a node comes back up as a secondary after a period of being offline and the oplog has looped on the primary?

> the entire dataset will be copied from the primary


##Connection to a Replica Set from Pymongo
The mongo shell allows connection to a single mongod, but the drivers support connection to an entire replica set and failing over automatically.

####Quiz
If you leave a replica set node out of the seedlist within the driver, what will happen?

> The missing node will be discovered as long as you list at least one valid node


##Bad Things Happen to Good Nodes
When fail-over occurs your app is going to see an exception on the collection.

The way drivers do connection pooling they keep connection open to mongo and fail-over occurs and a new primary is elected, the driver doesn't check if the connection is still good, hence the exception.

Dev. must make sure to use `try-except` block for all db processes.

checkout pymongo `mongo_client` class --> [High Availability and PyMongo](http://api.mongodb.org/python/current/examples/high_availability.html)

**MongoReplicaSetClient**

* will run watch dog processes and watch connection to replica set
* allows reads from secondaries

####Quiz
If you use the special MongoReplicaSetClient, are you guaranteed to avoid a network error due an intervening failover?

> No


##Write Concern Revisited

**`w` parameter**:  determines how many nodes you wait for before moving on when you do an insert (getLastError)

`w=1` will wait for the primary to acknowledge the write
`w=2` will wait for the primary and one other node to acknowledge the write
`w=3` will wait for the primary and two other nodes to acknowledge the write

`j=1` will wait for the primary to write all the way to disk

How long you wait is called `wtimeout`.
How long are you willing to wait for your writes to be acknowledged by your secondaries?

Wrtie concern (w, j) can be set in three places

1. set them on a connection
2. set them on a collection
3. configuration of the replica set (set defaults)

System Admins should configure on the replica set.

`w="majority"` waits for the majority of the nodes to replicate.

> To be clear, it is best practice to set w:majority to avoid having data rolled back in the case of a single node failure. Take the three node example. If you set w:majority, then at least one other node will have the date at the time of failover. That node will be preferred to take over as primary. At 2:42 I suggested this would be the case, but said I was not certain. I investigated it further and confirmed that the node that is furthest ahead will be preferred in the election of a new primary. --staff

`j` only waits to commit to journal on the primary node, not other nodes.

####Quiz
If you set w=1 and j=1, is it possible to wind up rolling back a committed write to the primary on failover?

> Yes


##Read Preferences
Driver default is read from same node that writes are done on.
Override by setting a `read preference`

Several standard read preferences inside drivers.
PyMongo has 4four:

1. Always read from the primary
2. Always read from the secondary
3. Secondary preferred (but take primary if no secondary)
4. Primary preferred (but if no primary take secondary)

You can also pick the `nearest` db
You can also assign `tags` to hosts inside a replica set (want reads to go to a particular tagged host)

If primary in CA and replicas across the country, can use 'tag' for host in NY.

{MongoReplicaSetClient](http://api.mongodb.org/python/current/api/pymongo/mongo_replica_set_client.html)
Go over the driver info

####Quiz
You can configure your applications via the drivers to read from secondary nodes within a replica set. What are the reasons that you might not want to do that? Check all that apply.

> If your write traffic is significantly greater than your read traffic, you may overwhelm the secondary, which must process all the writes as well as the reads. Replication lag can result.
You may not read what you previously wrote to MongoDB.
If the secondary hardware has insufficient memory to keep the read working set in memory, directing reads to it will likely slow it down.


##Review Implications of Replication
Replica sets are transparent to the developer
They are there to create stability, availability and fault tolerance.

Remember:
*  drivers must know about **seed lists**
*  distributed environment -- must know about **write concern** and the idea of acknowledging writes (w, j, wtimeout)
*  with multiple nodes must decide if you want to read from your primary (default) or secondaries (be ready for stale data)
*  must deal with errors (fail-over, network, etc) -- what data is needed/durable for application

###Quiz
If you set w=4 on a connection and there are only three nodes in the replica set, how long will you wait in PyMongo for a response from an insert if you don't set a timeout?

> more than 5five minutes


##Introduction to Sharding
Horizontal Scalability

Collections on many databases
Shards are made-up of replica sets and split data collection
Sharding is on a database level that means you must determine to shard or not to shard a collection.
If a db is not sharded it is automatically assinged to shard_0.

Queries are made to the router `mongos`, which keeps track of the connection pool and route queries properly.

Sharding uses a range-based approach
Shard key

Suppose you have an orders collections.  It is broken up into 'chuncks' of orders based on ranges of order_ids (shard keys).
Each 'chunk' belongs to one of the shards.
When a query is submitted to `mongos`, `mongos` looks at its mapping that contains where the `order_id` is being stored (shard key is included)

If the query does not include the shard key, `mongos` pings all the servers and gathers their responses and then responds to the application.

On any insert, the shard key must be sent along with it.

There can be more than one `mongos` (they are stateless)
Handled pretty much the same way as replica sets

Application connects to the `mongos` instead of the `mongod`s
The mongo shell can connect to the `mongos`

####Quiz
If the shard key is not include in a find operation and there are 3 shards, each one a replica set with 3 nodes, how many nodes will see the find operation?

> 3.  The primary of node in the replica set will respond


##Building a Sharded Environment
Build two shards with three replica sets each

You wouldn't run all the shards on a single computer.
Playing around port numbers is also not done in a real environment.
But because using the same host must have different port numbers.

Need config servers (little mongos servers that keep track of where the shards are)
They do not run on a replica set (two phase commits)

####Quiz
If you want to build a production system with two shards, each one a replica set with three nodes, how may mongod processes must you start?

> 9


##Implication of Sharding

* Every document must include the shard key
* The shard key is immutable (once set, you can't change it)
* Need an index that starts with the shard key (index cannot be a multikey index)
* For update, need to specify the key or multi
* No shard key, **scatter-gather** operation
* No unique index unless it's also part of the shard key (no way to enforce uniqueness)

####Quiz
Suppose you wanted to shard the zip code collection after importing it. You want to shard on zip code. What index would be required to allow MongoDB to shard on zip code?

> An index on zip or a non-multi-key index that starts with zip.


##Sharding + Replication
Almost always done together

**write concern**
Your app specifies that you have `(w, j)` and is passed to mongos which passes it to the shards
The app can take multiple `mongos`s

####Quiz
Suppose you want to run multiple mongos routers for redundancy. What level of the stack will assure that you can failover to a different mongos from within your application?

> drivers


##Choosing a Shard
In practice,

1. Sufficient cardinality
2. Avoid hot-spotting and writes (avoid monotonically increasing key)

An example:
PhotoSharing using `username` as the shard key

####Quiz
You are building a facebook competitor called footbook that will be a mobile social network of feet. You have decided that your primary data structure for posts to the wall will look like this:

<pre><code>
{'username':'toeguy',
     'posttime':ISODate("2012-12-02T23:12:23Z"),
     "randomthought": "I am looking at my feet right now",
     'visible_to':['friends','family', 'walkers']}
</code></pre>

Thinking about the tradeoffs of shard key selection, select the true statements below.

> * Choosing posttime as the shard key will cause hotspotting as time progresses.
* Choosing username as the shard key will distribute posts to the wall well across the shards.
* Choosing visible_to as a shard key is illegal.
