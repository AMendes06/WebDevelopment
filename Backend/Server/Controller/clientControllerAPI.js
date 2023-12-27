var Client = require("../../models/clientModel");

var clientController = {};

clientController.getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
};

clientController.getClientById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json('Client not found');
    }
    return res.json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
};

clientController.updateClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!client) {
      return res.status(404).json('Client not found!');
    }
    res.status(200).json({ message: 'Client updated successfully!', events: client });
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error.' );
  }
};

clientController.deleteClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found.' });
    }
    res.status(200).json({ message: 'Deleted successfully', client: client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = clientController;
