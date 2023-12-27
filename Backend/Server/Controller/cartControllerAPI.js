var Event = require('../../models/eventModel');
var Client = require("../../models/clientModel");
var Discount = require("../../models/discountModel");

var cartController = {};

const calculateSpentValue = async (tickets, events) => {
  let spentValue = 0;
  for (const ticket of tickets) {
    const eventFromDb = events.find((event) => event.name === ticket.event);
    if (!eventFromDb) {
      return 0;
    }
    const ticketPrice = await calculateTicketPrice(ticket.type, eventFromDb.price);
    spentValue += ticketPrice * ticket.quantity;
    console.log(spentValue);
  }
  return spentValue;
};

const calculateTicketPrice = async (ticketType, eventPrice) => {
  const discountModelId = "647dc4b474a9eafbafcf9cb1";
  try {
    const discountFromDb = await Discount.findById(discountModelId);
    let discount;
    if (ticketType === 'adult') {
      discount = discountFromDb.discountAdult;
    } else if (ticketType === 'child') {
      discount = discountFromDb.discountChild;
    } else if (ticketType === 'older') {
      discount = discountFromDb.discountOlder;
    }
    return eventPrice * discount;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

cartController.handleCart = async (req, res, next) => {
  try {
    const { tickets, emailClient, event } = req.body;

    const clientFromDb = await Client.findOne({ emailClient });
    if (!clientFromDb) {
      return res.status(400).json('Client not found.' );
    }
    const events = await Event.find();

    let spentValue = await calculateSpentValue(tickets, events);
    if (spentValue === 0) {
      return res.status(400).json( 'Invalid event found in ticket.' );
    }

    const eventFromDb = await Event.findOne({ event });
    if (!eventFromDb) {
      return res.status(400).json( 'Event not found.' );
    }

    if (!eventFromDb.availability) {
      return res.status(400).json('Event is not available.' );
    }

    const totalQuantity = tickets.reduce((acc, ticket) => acc + ticket.quantity, 0);
    if (eventFromDb.capacity < totalQuantity) {
      return res.status(400).json('Not enough capacity for the event.' );
    }

    const ticketData = (await Promise.all(tickets.map(async (ticket) => {
      const eventFromDb = events.find((event) => event.name === ticket.event);
      if (!eventFromDb) {
        return null;
      }
      const ticketPrice = await calculateTicketPrice(ticket.type, eventFromDb.price);
      return {
        event: ticket.event,
        type: ticket.type,
        quantity: ticket.quantity,
        price: ticketPrice,
      };
    }))).filter(ticket => ticket !== null);
    
    const totalPrice = spentValue;

    const cart = {
      emailClient,
      tickets: ticketData,
      totalPrice,
    };

    res.json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json('Failed to create ticket.' );
  }
};

cartController.discoutPoints = async (req, res, next) => {
  try {
    let { tickets, usePoints, pointsToSpend, emailClient } = req.body;
    const clientFromDb = await Client.findOne({ emailClient });
    if (!clientFromDb) {
      return res.status(400).json('Client not found.');
    }
    if (usePoints === true) {
      if (clientFromDb.points < pointsToSpend) {
        return res.status(400).json('Not enough points to spend.');
      }
      const discountModelId = "647dc4b474a9eafbafcf9cb1";
      const discountFromDb = await Discount.findById(discountModelId);
      const discountPerTicket = pointsToSpend * discountFromDb.systemPoints;

      tickets.forEach(ticket => {
        const discountedPrice = ticket.price - discountPerTicket;

        if (discountedPrice < 5) {
          const pointsToReturn = (5 - discountedPrice) / discountFromDb.systemPoints;
          clientFromDb.points += pointsToReturn;
          ticket.price = 5;
        } else {
          ticket.price = discountedPrice;
        }
      });

      clientFromDb.points -= pointsToSpend;
      await clientFromDb.save();
    }

    return res.status(200).json({ tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json('Failed to update ticket prices.');
  }
};

module.exports = cartController;
