var Client = require("../models/clientModel");

var clientController = {};


//create client
clientController.createClient = async (req, res, next) => {
  const client = new Client({ ...req.body });
  try {
    const clientFromDb = await Client.findOne({ emailClient: client.emailClient });
    if (clientFromDb) {
      return res
        .status(400)
        .render("addClient", { message: "Client already registered." });
    }
    await client.save();
    res.redirect("client");
  } catch (error) {
    res.render("addClient", { message: "Something went wrong." });
  }
};

//get all clients
clientController.getAllClient = async (req, res, next) => {
  try {
    const client = await Client.find();
    res.render("client", {client});
  } catch (error) {
    res.render("client", { message: "Something went wrong." });
  }
};

//update Client
clientController.updateClient = async (req, res, next) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!client) {
        return res
          .status(404)
          .render("refactorClient", { message: "Client not found." });
      }
      res.render("refactorClient", { message: "Client has been uptated.", client } );
    } catch (error) {
      res.render("refactorClient", { message: "Something went wrong." });
    }
  };

  //delete ticket
clientController.deleteClient = async (req, res, next) => {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);
      if (!client) {
        return res
          .status(404)
          .render("client", { message: "Client not found." });
      }
      res.render("client", { message: "Client has been deleted.", client});
    } catch (error) {
      res.render("client", { message: "Something went wrong." });
    }
  };
  module.exports = clientController;