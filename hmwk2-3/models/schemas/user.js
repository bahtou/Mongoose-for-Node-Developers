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
UserSchema.methods.authenticate = function(plainText) {
    return this.makePwHash(plainText) === this.hashed_password;
  };

UserSchema.methods.makeSalt = function() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    salt = '';
    for(var i=0; i < 5; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      salt = salt + chars[rnum];
    }
    return salt;
};

UserSchema.methods.makePwHash = function(password, salt) {
    salt = salt || this.makeSalt();
    return crypto.createHmac('sha256', salt).update(password).digest('hex') + ',' + salt;
};


// module.exports = UserSchema;
// mongoose.model('User', UserSchema);