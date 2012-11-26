var port = process.env.PORT || 3000;

module.exports = {
  development: {
    port: port,
    mongodb: {
      host: 'localhost',
      port:  27017,
      database: 'm101Blog'
    }
  },
  production: {},
  testing: {}
};