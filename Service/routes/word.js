var express =  require('express');
var route =  express.Router();
var controller = require('../controllers/controller')

route.get('/list', controller.list )
route.post('/insert', controller.insert )
route.put('/update', controller.update )
route.delete('/delete', controller.delete )

module.exports = route;
