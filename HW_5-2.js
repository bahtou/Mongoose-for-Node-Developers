/*
HOME WORK 5-2
-------------

Crunching the Zipcode dataset
Please download the zips.json dataset and import it into a collection of your choice.

Please calculate the average population of cities in California (abbreviation CA) and New York (NY) (taken together) with populations over 25,000.

For this problem, assume that a city name that appears in more than one state represents two separate cities.

Please round the answer to a whole number.
Hint: The answer for CT and NJ is 49749.
*/

db.zips.aggregate([
  {$match: {
            state: {$in: ["CA", "NY"]}}
          },
  {$group: {
            _id: {state: "$state", city: "$city"},
            totalPop: {$sum: "$pop"}}
          },
  {$match: {
            totalPop: {$gt: 25000}}
          },
  {$group: {
            _id: "Average population of CA and NY",
            avgPop: {$avg: "$totalPop"}}
          }
])

/*
  First select out the two states to aggregate on.
  Group the documents by (state, city) and sum the population.  The resultant document has a total population size per city per state.
  Then, filter out the total population for the condition > 25,000.  The resultant document just contains those (city, state) that have a population over 25000.
  All we have left to do is average out the (city, state) total populations of the two states.

*/
