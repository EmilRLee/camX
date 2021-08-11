const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    org: String,
    devices: [String] 
});

module.exports = mongoose.model("User", schema)