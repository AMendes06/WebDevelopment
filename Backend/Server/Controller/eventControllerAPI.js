var Event = require("../../models/eventModel");

var eventController = {};

eventController.getAllEvents = async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(200).json( events );
    } catch (error) {
        return res.status(400).send("Something went wrong");
    }
  };

  eventController.getEventById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json('Event not found' );
      }
      return res.json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json('Internal Server Error' );
    }
  };
  

module.exports = eventController;
