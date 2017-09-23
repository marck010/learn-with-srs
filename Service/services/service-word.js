var model = require('../models/word-model.js');

var ServicoWord = {};

ServicoWord.insert = function(object) {
    object.learned = false;
    object.date = new Date();
    object.active = true;
    return model.create(object);
}

ServicoWord.update = function(object) {

    var objectToSave;

    return model.findById(object._id).then(function(word) {

        objectToSave = word._doc;

        object.date = new Date();
        object.active = true;

        return new Promise(function(resolve, reject) {
            model.update({ _id: object._id }, object, function(error, doc) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(doc);
            });

        })

    }).then(function() {

        objectToSave.active = false;
        objectToSave.wordRelated = object._id;
        delete objectToSave._id;
        return new Promise(function(resolve, reject) {
            model.create(objectToSave, function(error, doc) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(doc);
            });
        })


    })
}

ServicoWord.delete = function(id) {
    return new Promise(function(resolve, reject) {

        model.remove({ _id: id }, function(error, doc) {
            if (error) {
                reject(error);
                return;
            }
            resolve(doc);
        });

    });

}

ServicoWord.list = function(filtro) {

    filtro.active = true;
    return new Promise(function(resolve, reject) {

        model.find(filtro, function(error, doc) {

            if (error) {
                reject(error);
                return;
            }

            resolve(doc);
        }).sort({ date: -1 });

    });
}

module.exports = ServicoWord;