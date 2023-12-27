var express = require("express");
var router = express.Router();
var clientController = require("../controllers/clientController");
var employeeController = require("../controllers/employeeController");
var Client = require("../models/clientModel");

router.post("/createClient", employeeController.verifyToken, clientController.createClient);
router.post("/refactorClient/:id", employeeController.verifyToken, clientController.updateClient);
router.get("/deleteClient/:id", employeeController.verifyToken, clientController.deleteClient);

router.get("/client", employeeController.verifyToken, clientController.getAllClient, async (req, res) => {
  const token = req.cookies.token;
  res.render("client", { client, token });
});
router.get('/createClient', employeeController.verifyToken, (req, res, next) => {
  const token = req.cookies.token;
  res.render('addClient', { token, menssage: ""});
});

router.get("/refactorClient/:id", employeeController.verifyToken, async (req, res) => {
  const client = await Client.findById(req.params.id);
  const token = req.cookies.token;
  res.render('refactorClient', { client, token, menssage: "" });
});

module.exports = router;
