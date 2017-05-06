var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routeWord = require('./routes/word');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, ApiKeyPersona, SessionKey");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    if (mongoose.connection.readyState == 3 || mongoose.connection.readyState == 0) {
        mongoose.connect('mongodb://172.18.0.1:27017/dictionary', function(error) {
            if (error) {
                next(error)
                console.log(error);
                return;
            }
            next();
            console.log('Conected mongodb');

        });
        return;
    }
    next();
})
app.use('/word', routeWord);

module.exports = app;