const mongoose = require('mongoose');

const hls = mongoose.Schema({
    user: String,
    device: String,
    isrunning: Boolean,
    uri: String
});

module.exports = mongoose.model("Hls", hls)