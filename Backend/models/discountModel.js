const mongoose = require('mongoose');

const discountSchema = mongoose.Schema(
  {
    discountChild: {
      type: Number,
      trim: true,
    },
    discountAdult: {
      type: Number,
      trim: true,
    },
    discountOlder: {
      type: Number,
      trim: true,
    },
    systemPoints: {
      type: Number,
      trim: true,
    }
  }
);

module.exports = mongoose.model("discount", discountSchema);
