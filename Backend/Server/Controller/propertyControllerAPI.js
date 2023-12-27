var Property = require("../../models/propertyModel");
var Event = require("../../models/eventModel");

var propertyController = {};

propertyController.getAllProperties = async (req, res, next) => {
    try {
      const properties = await Property.find();
      res.status(200).json( properties );
    } catch (error) {
        return res.status(400).send("Something went wrong");
    }
  };

  propertyController.getEventsByProperty = async (req, res, next) => {
    try {
      const { propertyName } = req.params;
  
      const propertyFromDb = await Property.findOne({ propertyName: propertyName });
      if (!propertyFromDb) {
        return res.status(400).json('Property not found.');
      }
  
      const events = await Event.find({ 'property.propertyName': propertyName });
      if (events.length === 0) {
        return res.status(400).json('No events found for the specified property.');
      }
  
      res.status(200).json(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      res.status(500).json('Failed to fetch events.');
    }
  };
  


module.exports = propertyController;
