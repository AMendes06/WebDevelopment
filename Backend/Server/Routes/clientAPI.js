var express = require('express');
var router = express.Router();

var clientControllerAPI = require("../../Server/Controller/clientControllerAPI")
var authControllerAPI = require("../../Server/Controller/authControllerAPI")

router.get('/getClients', authControllerAPI.verifyToken, clientControllerAPI.getAllClients);
router.get('/clientById/:id', authControllerAPI.verifyToken, clientControllerAPI.getClientById);
router.put('/updateClient/:id',authControllerAPI.verifyToken, clientControllerAPI.updateClient);
router.delete('/deleteClient/:id',authControllerAPI.verifyToken, clientControllerAPI.deleteClient);

module.exports = router;