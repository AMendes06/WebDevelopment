var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var { authSecret } = require("../.env");
var Event = require('../models/eventModel');
var Client = require("../models/clientModel");
var Ticket = require("../models/ticketModel");
var ticketController = require('../controllers/ticketController');
var employeeController = require('../controllers/employeeController');

router.post('/createTicket', employeeController.verifyToken, ticketController.createTicket) ;
router.get('/ticket', employeeController.verifyToken, ticketController.getAllTickets);
router.post("/updateDiscount", employeeController.verifyTokenAndRoleAdmin, ticketController.refactorDiscount);

router.get('/createTicket', employeeController.verifyToken, async (req, res, next) => {
  const events = await Event.find();
  const clients = await Client.find();
  const tickets = await Ticket.find();
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, authSecret);
  const email = decodedToken.employee.email;
  console.log("Email: " ,email)
  res.render('sellTicket', { token, clients, events, email, tickets });

});



router.get("/updateDiscount", employeeController.verifyTokenAndRoleAdmin, async (req, res) => {
  const token = req.cookies.token;
  res.render('updateDiscount', { token });

});

module.exports = router;