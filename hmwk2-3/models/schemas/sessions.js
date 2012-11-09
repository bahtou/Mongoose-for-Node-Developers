var mongoose = require('mongoose')
  , crypto = require('crypto');

var SessionSchema = module.exports = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  }
}, {
  collection: 'sessions',
  safe: true
});

SessionSchema.methods.hashStr = function(s) {
  var key = 'thisisnotsecret';
  return crypto.createHmac('md5', key).update(s).digest('hex');
};

SessionSchema.methods.makeSecureVal = function(s) {
  return s + '|' + this.hashStr(s);
};

SessionSchema.methods.checkSecureVal = function(h) {
  var val = h.split('|')[0];
  if (h === this.makeSecureVal(val))
    return val;
};