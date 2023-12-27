var express = require("express");
var router = express.Router();
var employeeController = require("../controllers/employeeController");

router.post("/register", employeeController.createEmployee);
router.post("/login", employeeController.login);
router.get("/logout", employeeController.logout);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
