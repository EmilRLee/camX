const mongoose = require('mongoose');

const schema = mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    devices: Array,
    users: Array

});

module.exports = mongoose.model("User", schema)