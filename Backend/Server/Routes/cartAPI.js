var express = require('express');
var router = express.Router();

var cartControllerAPI = require("../../Server/Controller/cartControllerAPI")
var authControllerAPI = require("../../Server/Controller/authControllerAPI")

router.post('/handleCart',authControllerAPI.verifyToken,cartControllerAPI.handleCart);
router.post('/discountPoints',authControllerAPI.verifyToken,cartControllerAPI.discoutPoints);

module.exports = router;