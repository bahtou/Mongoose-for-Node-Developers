var mongoose = require( 'mongoose' );

module.exports.connect = function( config, callback ) {
  var uri = 'mongodb://';
  if (config.username && config.password) {
    uri += config.username + ':' + config.password + '@';
  }
  uri += config.host;
  if (config.port) {
    uri += ':' + config.port;
  }
  uri += '/' + config.database;
  console.log('Connecting to Mongo', {
    host : config.host,
    port : config.port,
    database : config.database
  });
  uri += '/?safe=true';

  mongoose.connect(uri, callback);
};
