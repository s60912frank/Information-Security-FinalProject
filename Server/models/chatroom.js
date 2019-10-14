let mongoose = require('mongoose');
let shortid = require('shortid');
let crypto = require('crypto');

let crSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  name: String,
  key: { type: String, 'default': crypto.randomBytes(32).toString("base64") }, //改成readonly比較好
  messages: [],
  owner: String
}, {
  usePushEach: true
});

module.exports = mongoose.model('Chatroom', crSchema);