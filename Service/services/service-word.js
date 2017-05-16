var model = require('../models/word-model.js');

var ServicoWord = {};

ServicoWord.insert = function(object) {
    object.learned = false;
    object.date = new Date();
    return model.create(object);
}

ServicoWord.update = function(object) {
    object.date = new Date();
    return model.findByIdAndUpdate(object._id, object)
}

ServicoWord.delete = function(id) {
    return model.remove({ _id: id })
}

ServicoWord.list = function(filtro) {
    return model.find(filtro).sort({date:-1});
}

module.exports = ServicoWord;