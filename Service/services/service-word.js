var model = require('../models/word-model.js');

var ServicoWord = {};

ServicoWord.insert = function(object) {
    object.learned = false;
    object.date = new Date();
    object.active = true;
    return model.create(object);
}

ServicoWord.update = function(object) {

    return model.findById(object._id).then(function(word) {

        word.active = false;
        return model.update({ _id: object._id }, word);

    }).then(function() {
        object.learned = false;
        object.date = new Date();
        object.active = true;
        object.wordRelated = object._id;
        delete object._id;
        return model.create(object);

    })
}

ServicoWord.delete = function(id) {
    return model.remove({ _id: id })
}

ServicoWord.list = function(filtro) {
    filtro.active = true;
    return model.find(filtro).sort({ date: -1 });
}

module.exports = ServicoWord;