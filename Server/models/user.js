let mongoose = require('mongoose');
let shortid = require('shortid');

let userSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  name: String,
  password: String
}, {
  usePushEach: true
});

module.exports = mongoose.model('User', userSchema);