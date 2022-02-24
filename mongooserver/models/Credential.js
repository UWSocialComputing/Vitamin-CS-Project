const mongoose = require("mongoose")

const schema = mongoose.Schema({
    username: String,
    password: String,
})

module.exports = mongoose.model("Post", schema)