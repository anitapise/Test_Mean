
const mongoose = require('mongoose');

//User Model
var User = mongoose.model('User', {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profile_pic: { type: String }
});

module.exports = { User }