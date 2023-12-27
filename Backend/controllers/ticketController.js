var Ticket = require('../models/ticketModel');
var Event = require('../models/eventModel');
var Employee = require("../models/employeeModel");
var Client = require("../models/clientModel");
var Discount = require("../models/discountModel");

var ticketController = {};

// Create a new ticket
ticketController.createTicket = async (req, res, next) => {
  try {
    const { emailClient, tickets, totalPrice, event, employee } = req.body;

    // Find the client based on the email
    const clientFromDb = await Client.findOne({ emailClient });
    if (!clientFromDb) {
      return res.status(400).render("sellTicket", { message: 'Client not found.' });
    }

    // Find the event based on the event ID
    const eventFromDb = await Event.findById(event);
    if (!eventFromDb) {
      return res.status(400).render("sellTicket", { message: 'Event not found.' });
    }

    // Calculate total quantity and check availability
    const quantity = tickets.reduce((total, ticket) => total + ticket.quantity, 0);
    if (!eventFromDb.availability) {
      return res.status(400).render("sellTicket", { message: 'Event is not available.' });
    }
    if (eventFromDb.capacity < quantity) {
      return res.status(400).render("sellTicket", { message: 'Not enough capacity for the event.' });
    }

    // Calculate total spent value
    const valueSpent = tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);

    // Create ticket documents
    const ticketDocuments = tickets.map(ticket => new Ticket({
      employee,
      event: eventFromDb._id,
      client: clientFromDb._id,
      ticketChild: ticket.type === 'child' ? ticket.quantity : 0,
      ticketAdult: ticket.type === 'adult' ? ticket.quantity : 0,
      ticketOlder: ticket.type === 'older' ? ticket.quantity : 0,
      quantity: ticket.quantity,
      spentValue: ticket.price * ticket.quantity
    }));

    // Save ticket documents
    await Promise.all(ticketDocuments.map(ticket => ticket.save()));

    // Update event capacity and availability
    eventFromDb.capacity -= quantity;
    if (eventFromDb.capacity === 0) {
      eventFromDb.availability = false;
    }
    await eventFromDb.save();

    res.redirect("ticket");
  } catch (error) {
    console.log(error);
    return res.status(500).render("sellTicket", { message: 'Failed to create ticket.' });
  }
};





// Get all tickets
ticketController.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();

    res.render('ticket', { tickets })
  } catch (err) {
    console.error(err);
    return res.status(500).render('ticket', { message: "Failed to get tickets." });
  }
};


//Update ticket Discount
ticketController.refactorDiscount = async (req, res) => {
  try {
    const { discountChild, discountAdult, discountOlder, systemPoints } = req.body;

    const newData = {
      discountChild: (100 - discountChild) / 100,
      discountAdult: (100 - discountAdult) / 100,
      discountOlder: (100 - discountOlder) / 100,
      systemPoints,
    };


    const updatedDiscount = await Discount.findByIdAndUpdate(
      "647dc4b474a9eafbafcf9cb1",
      newData,
      { new: true }
    );

    if (!updatedDiscount) {
      return res.status(404).render('updateDiscount', { message: 'Discount not found!' });
    }

    res.render('updateDiscount', { message: 'Discount update successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).render('updateDiscount', { message: 'Internal Server Error.' });
  }
};



module.exports = ticketController;