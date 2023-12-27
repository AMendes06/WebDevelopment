var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
var employeeController = require("../controllers/employeeController");
var Event = require("../models/eventModel");
var Property = require("../models/propertyModel");

router.post("/createEvent", employeeController.verifyTokenAndRoleAdmin, eventController.createEvent);
router.get('/event', employeeController.verifyToken, eventController.getAllEvents);
router.get('/getEventById/:id', employeeController.verifyTokenAndRoleAdmin, eventController.getEventById);
router.post('/refactorEvent/:id', employeeController.verifyTokenAndRoleAdmin, eventController.updateEvent);
router.get('/deleteEvent/:id', employeeController.verifyTokenAndRoleAdmin, eventController.deleteEvent);

router.get('/createEvent', employeeController.verifyTokenAndRoleAdmin,async (req, res, next) => {
  const properties = await Property.find();
  const token = req.cookies.token;
  res.render('addEvent', { token , properties});
});

router.get("/refactorEvent/:id", employeeController.verifyTokenAndRoleAdmin, async (req, res) => {
  const events = await Event.findById(req.params.id);
  const properties = await Property.find();
  const token = req.cookies.token;
  res.render('refactorEvent', { events, properties, token});

});

module.exports = router;