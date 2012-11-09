On using Node.js Driver MongoDB
===============================
The Node.js Driver [mongodb](http://mongodb.github.com/node-mongodb-native/api-articles/nodekoarticle1.html) is great!  
Very similar to the mongo shell.  

Here is the [tutorial](http://mongodb.github.com/node-mongodb-native/api-articles/nodekoarticle1.html) to get you started.  

I attempted three ways of pulling data from mongo:  

1.  using `each`
2.  using `toArray`
3.  using `streams`

... go with streams if you ask me :)  
Look closely on how each method has to be setup in order to play nice.  
This is because of the Event-driven nature of JS.


** The way the connection to mongo is executed is straight forward without the need of defining a schema and model (like in mongoose).
Nuances
-------

---
This warning keeps coming up unless you specifically put `{safe: true}` as in:  
`var db = new Db('m101', server), {safe: true};`

========================================================================================  

=  Please ensure that you set the default safe variable to one of the                  =  
=   allowed values of [true | false | {j:true} | {w:n, wtimeout:n} | {fsync:true}]     =  
=   the default value is false which means the driver receives does not                =  
=   return the information of the success/error of the insert/update/remove            =  
=                                                                                      =  
=   ex: new Db(new Server('localhost', 27017), {safe:false})                           =  
=                                                                                      =  
=   http://www.mongodb.org/display/DOCS/getLastError+Command                           =  
=                                                                                      =  
=  The default of false will change to true in the near future                         =   
=  This message will disappear when the default safe is set on the driver Db 		   =  

========================================================================================  