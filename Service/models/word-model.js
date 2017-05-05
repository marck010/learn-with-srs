var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    word: { type: String, require: true },
    date: { type: Date, require: true },
    translates: [{
        translate: { type: String, require: true },
        complement: String
    }]

})

module.exports = mongoose.model("word", schema);