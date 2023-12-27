var express = require('express');
var router = express.Router();

var authControllerAPI = require("../../Server/Controller/authControllerAPI")

router.post('/registerAPI', authControllerAPI.createUser);
router.post('/loginAPI', authControllerAPI.login);

module.exports = router;