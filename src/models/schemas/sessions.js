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

SessionSchema.method({

  hashStr: function(s) {
    var key = 'thisisnotsecret';
    return crypto.createHmac('md5', key).update(s).digest('hex');
  },

  makeSecureVal: function(s) {
    return s + '|' + this.hashStr(s);
  },

  checkSecureVal: function(h) {
    console.log('check secure value: ' + h);
    if (h.split('.')[0])
      h = h.split('.')[0];
    var val = h.split('|')[0];
    if (h === this.makeSecureVal(val))
      return val;
  }
});