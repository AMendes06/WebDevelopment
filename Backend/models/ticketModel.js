const mongoose = require("mongoose");

const TYPE = ["child", "adult", "older"];

const ticketSchema = mongoose.Schema({
  client: {
    type: Object,
  },
  employee: {
    type: Object,
  },
  tickets: [
    {
      event: {
        type: Object,
        required: true,
      },
      type: {
        type: String,
        enum: TYPE,
        required: true,
        default: "adult",
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  pointsToSpend: {
    type: Number,
    default: 0,
  },
  usePoints: {
    type: Boolean,
    default: false,
  },
  totalPrice: {
    type: Number,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
