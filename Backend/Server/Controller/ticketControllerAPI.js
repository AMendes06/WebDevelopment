var Ticket = require("../../models/ticketModel");
var Event = require('../../models/eventModel');
var Client = require("../../models/clientModel");
const stripe = require("stripe")('sk_test_51NH70CCtH88rjNYBMe3J6DRUIPjzarLxdaCRs1S5qmyUBWlHerDmTbCeXt3pmx4G8Gn8BZoF8e4EmFEPVRf64LGd00X5bABkp0');

var ticketController = {};

ticketController.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
};

ticketController.getTicketsByClient = async (req, res, next) => {
  try {
    const { emailClient } = req.params;

    const clientFromDb = await Client.findOne({ emailClient });
    if (!clientFromDb) {
      return res.status(400).json('Client not found.');
    }

    const tickets = await Ticket.find({ client: clientFromDb.emailClient });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    res.status(500).json('Failed to fetch tickets.');
  }
};

ticketController.checkoutCart = async (req, res, next) => {
  try {
    const { emailClient, tickets, totalPrice, event, usePoints, pointsToSpend } = req.body;

    const clientFromDb = await Client.findOne({ emailClient });
    if (!clientFromDb) {
      return res.status(400).json('Client not found.' );
    }
    const events = await Event.find();

    const eventFromDb = await Event.findOne({ event });
    if (!eventFromDb) {
      return res.status(400).json('Event not found.' );
    }

    const earnedPoints = Math.floor(totalPrice * 0.5);
    if (!usePoints) {
      clientFromDb.points += earnedPoints;
      if (clientFromDb.points > 200) {
        clientFromDb.points = 200;
      }
    }
    await clientFromDb.save();

    const ticketData = (await Promise.all(tickets.map(async (ticket) => {
      const eventFromDb = events.find((event) => event.name === ticket.event);
      if (!eventFromDb) {
        return null;
      }
      
      eventFromDb.capacity -= ticket.quantity
      if(eventFromDb.capacity === 0){
        eventFromDb.availability = false
      }

      await eventFromDb.save()
      return {
        event: eventFromDb,
        type: ticket.type,
        quantity: ticket.quantity,
        price: ticket.price
      };
    }))).filter(ticket => ticket !== null);

    const cart = new Ticket({
      client: clientFromDb.emailClient,
      event: eventFromDb,
      tickets: ticketData,
      usePoints: usePoints,
      pointsToSpend : pointsToSpend,
      totalPrice: totalPrice,
    });

    const savedCart = await cart.save();

    res.json( savedCart );
  } catch (error) {
    console.error('Failed to save cart:', error);
    res.status(500).json('Failed to save cart.' );
  }
};

ticketController.payment = async (req, res, next) => {
  try {
    const { tickets } = req.body;
    
    const lineItems = tickets.map((ticket) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: ticket.event,
        },
        unit_amount: ticket.price * 100,
      },
      quantity: ticket.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/events',
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    next(error);
  }
};

module.exports = ticketController;
