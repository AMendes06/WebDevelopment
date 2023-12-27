const Event = require('../models/eventModel');
const Property = require('../models/propertyModel');
var eventController = {};

eventController.createEvent = async (req, res, next) => {
  try {
    const propertyFromDb = await Property.findOne({ propertyName: req.body.propertyName });
    if (!propertyFromDb) {
      return res.status(400).render('addEvent',{ message: 'Property not found.' });
    }
    const event = new Event({
      ...req.body,
      property: propertyFromDb ,
      capacity: propertyFromDb.capacity
    });
    await event.save();
    res.redirect('event');
  } catch (error) {
    console.log(error);
    res.status(500).render('addEvent', { message: 'Internal server error' });
  }
};

eventController.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();

    res.render('event', { events })
  } catch (error) {
    console.log(error);
    return res.status(500).render('event', { message: 'Internal Server Error' });
  }
};

//get event by id
eventController.getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).render('event', { message: 'Event not found' })
    }
  } catch (error) {
    console.error(err);
    return res.status(500).render('event', { message: 'Internal Server Error' });
  }
};

//update Event By Id
eventController.updateEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).render('event', { message: 'Event not found!' });
    }
    res.render('event', { message: 'Event Refactor successfull', events: event });
  } catch (error) {
    console.error(error);
    return res.status(500).render('event', { message: 'Internal Server Error.' });
  }
};

// Delete an event by id
eventController.deleteEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).render('event', { message: 'Event not found.' });
    }
    res.render('event', { message: 'Deleted successfull', events: event });
  } catch (err) {
    console.error(err);
    res.status(500).render('event', { message: 'Internal Server Error' });
  }
};

module.exports = eventController;