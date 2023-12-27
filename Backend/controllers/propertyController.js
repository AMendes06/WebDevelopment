var Property = require("../models/propertyModel");
const fetch = require('isomorphic-fetch');


var propertyController = {};

propertyController.createProperty = async (req, res, next) => {
  const property = new Property({ ...req.body });
  property.image = req.file != null ? req.file.filename : null;

  try {
    const propertyFromDb = await Property.findOne({ propertyName: property.propertyName });
    if (propertyFromDb) {
      return res
        .status(400)
        .render("addProperty", { message: "Property already registered." });
    }

    // API GEOAPIFY 
    const geoapifyResponse = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(property.address)}&apiKey=8011bedc7d4146e6a5d9c9bad22b3275`);
    const geoapifyData = await geoapifyResponse.json();

    // VERIFY RESPONSE
    if (geoapifyData.features.length > 0) {
      const address = geoapifyData.features[0].properties;

      // REFRESH DATABASE WITH NEW SATA
      property.street = address.street;
      property.city = address.city;
      property.postalCode = address.postcode;
      property.country = address.country;
    }

    // SAVE PROPERTY
    await property.save();
    res.redirect('property');
  } catch (error) {
    res.render("addProperty", { message: "Something went wrong." });
  }
};

// Get all properties
propertyController.getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.render("property", { properties });
  } catch (error) {
    res.render("property", { message: "Something went wrong." });
  }
};

// Get a property by ID
propertyController.getByIdProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .render("property", { message: "Property not found." });
    }
    return res.status(200).json({ property });
  } catch (error) {
    res.render("property", { message: "Something went wrong." });
  }
};

propertyController.updateProperty = async (req, res, next) => {
  try {
    const updatedProperty = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) { // Check if exist property
      return res.status(404).render("refactorProperty", { message: "Property not found." });
    }

    // Verify new address
    if (updatedProperty.address !== property.address) {
      // Send and receive data from API
      const geoapifyResponse = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(updatedProperty.address)}&apiKey=8011bedc7d4146e6a5d9c9bad22b3275`);
      const geoapifyData = await geoapifyResponse.json();

      // Verify API response
      if (geoapifyData.features.length > 0) {
        const address = geoapifyData.features[0].properties;

        // Update location data
        property.street = address.street;
        property.city = address.city;
        property.postalCode = address.postcode;
        property.country = address.country;
      }
    }

    // Update data
    property.propertyName = updatedProperty.propertyName;
    property.address = updatedProperty.address;
    property.description = updatedProperty.description;
    property.capacity = updatedProperty.capacity;
    property.availability = updatedProperty.availability;

    // Save property in the database
    const updatedPropertyResult = await property.save();

    res.render("refactorProperty", { message: "Property has been updated.", property: updatedPropertyResult });
  } catch (error) {
    res.render("refactorProperty", { message: "Something went wrong." });
  }
};


// Delete a property
propertyController.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res
        .status(404)
        .render("property", { message: "Property not found." });
    }
    res.render("property", { message: "Property has been deleted.", properties: property });
  } catch (error) {
    res.render("property", { message: "Something went wrong." });
  }
};


module.exports = propertyController;
