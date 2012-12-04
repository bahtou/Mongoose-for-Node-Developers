/*
HOME WORK 5-1
-------------

Finding the most frequent author of comments on your blog
In this assignment you will use the aggregation framework to find the most frequent author of comments on your blog. We will be using the same dataset as last week.

Start by downloading the posts.json dataset from last weeks homework, found in hw4-3.tar or hw4-3.zip. Then import into your blog database as follows:

mongoimport -d blog -c posts --drop < posts.json

Now use the aggregation framework to calculate the author with the greatest number of comments.

To help you verify your work before submitting, the author with the least comments is Mariela Sherer and she commented 387 times.
*/

db.posts.aggregate([{$project: {_id: 0, comments: "$comments"}}, {$unwind: "$comments"}, {$group: {_id: "$comments.author", count: {$sum: 1}}}, {$sort: {count: -1}}])

/*
  Using $first and $last
*/

db.posts.aggregate([{$project: {_id: 0, comments: "$comments"}}, {$unwind: "$comments"}, {$group: {_id: "$comments.author", count: {$sum: 1}}}, {$sort: {count: -1}}, {$group: {_id: "First and Last", first: {$first: "$_id"}, last: {$last: "$_id"}}}])
