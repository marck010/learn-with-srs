    var service = require("../services/service-word");
    var controller = {};

    controller.list = function(req, res, next) {
        service.list(req.filter).then(function(docs) {
            docs.forEach(function(doc) {
                if (doc._doc.date) {
                    doc._doc.date = doc._doc.date.toLocaleDateString();
                }
            })
            res.json(docs);
        })
    }

    controller.insert = function(req, res, next) {
        try {
            service.insert(req.body.obj).then(function(doc) {
                res.json(doc);
            })
        } catch (error) {
            next(error);
        }
    }

    controller.update = function(req, res, next) {
        try {
            service.update(req.body.obj).then(function(doc) {

                res.json(doc);

            }).catch(function(error) {
                res.json(error);

            })
        } catch (error) {
            next(error);
        }
    }

    controller.delete = function(req, res, next) {
        service.delete(req.query._id).then(function(doc) {
            res.json(doc);
        })
    }

    module.exports = controller;