var express = require('express');
var router = express.Router();

var propertyControllerAPI = require("../../Server/Controller/propertyControllerAPI")
var authControllerAPI = require("../../Server/Controller/authControllerAPI")

router.get('/getProperties', propertyControllerAPI.getAllProperties);
router.get('/eventsByProperty/:propertyName', propertyControllerAPI.getEventsByProperty)

module.exports = router;