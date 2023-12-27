const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
  }
);

module.exports = mongoose.model("Property", propertySchema);