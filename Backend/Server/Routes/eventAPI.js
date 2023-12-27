var express = require('express');
var router = express.Router();

var eventControllerAPI = require("../../Server/Controller/eventControllerAPI")

router.get('/getEvents', eventControllerAPI.getAllEvents);
router.get('/eventByid/:id',eventControllerAPI.getEventById);

module.exports = router;