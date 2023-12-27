var express = require('express');
var router = express.Router();

var ticketControllerAPI = require("../../Server/Controller/ticketControllerAPI")
var authControllerAPI = require("../../Server/Controller/authControllerAPI")

router.get('/getTickets',authControllerAPI.verifyToken, ticketControllerAPI.getAllTickets);
router.get('/ticketsByClient/:emailClient', ticketControllerAPI.getTicketsByClient)
router.post('/checkoutCart', ticketControllerAPI.checkoutCart);
router.post('/payment', ticketControllerAPI.payment);

module.exports = router;