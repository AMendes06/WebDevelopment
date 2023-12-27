const mongoose = require('mongoose');

const ROLES = ['staff', 'admin'];

const employeeSchema = mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLES,
      default: 'staff',
    },
  }
);

module.exports = mongoose.model("Employee", employeeSchema);