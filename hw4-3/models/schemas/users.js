/*
    User schema
*/
var mongoose = require('mongoose')
  , crypto = require('crypto');

var UserSchema = module.exports = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      index: {unique: true}
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String
    }
}, {
  collection: 'users',
  safe: true
});

// methods
UserSchema.method({

  authenticate: function(passwordSalt, password, salt) {
    return this.makePwHash(password, salt) === passwordSalt;
  },

  makeSalt: function() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    salt = '';
    for(var i=0; i < 5; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      salt = salt + chars[rnum];
    }
    return salt;
  },

  // note that `.update(password)` changes the value of password making login validation tricky
  makePwHash: function(password, salt) {
    salt = salt || this.makeSalt();
    return crypto.createHmac('sha256', salt).digest('hex') + ',' + salt;
  }

});

// module.exports = UserSchema;
// mongoose.model('User', UserSchema);