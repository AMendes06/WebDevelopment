const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: Number,
      required: true,
      trim: true,
    },
    emailClient: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    nif: {
      type: Number,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
    },
  }
);

module.exports = mongoose.model("Client", clientSchema);
