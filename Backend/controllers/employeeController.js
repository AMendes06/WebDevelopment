var bcrypt = require("bcryptjs");
var Employee = require("../models/employeeModel");
var jwt = require("jsonwebtoken");
var { authSecret } = require("../.env");

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

var employeeController = {};

employeeController.createEmployee = async (req, res, next) => {
  const employees = new Employee({ ...req.body });
  try {
    const userFromDb = await Employee.findOne({ email: employees.email });
    if (userFromDb) {
      return res.status(400).render("register", { message: "User already registered." });
    }
    employees.password = encryptPassword(employees.password);
    await employees.save();
    const token = jwt.sign({ employee: employees }, authSecret, {
      expiresIn: 86400, // 24 hours
    });
    res.cookie("token", token, { maxAge: 86400, httpOnly: true });
    res.render("register", { message: "User created successfully." });
  } catch (error) {
    res.render("register", { message: "Something went wrong." });
  }
};

employeeController.login = async (req, res, next) => {
  try {
    const employees = await Employee.findOne({ email: req.body.email });
    if (!employees) {
      return res.status(400).render("login", { message: "User not found!" });
    }
    const isMatch = bcrypt.compareSync(req.body.password, employees.password);
    if (!isMatch) {
      return res.status(401).render("login", { message: "Invalid password!" });
    }
    const token = jwt.sign({ employee: employees }, authSecret, {
      expiresIn: 86400000,
    });
    res.cookie("token", token, { maxAge: 864000000, httpOnly: true });

    if (token) {
      res.redirect("property")
      res.status(201).json({ auth: true, token: token });
    } else {
      res.render("login", { message: "Login unsuccessful." });
    }
  } catch (error) {
    next(error);
  }
};

employeeController.logout = function (req, res) {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect("login");
};

employeeController.verifyToken = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).render("login", { message: "No token provided." });
  } else {
    jwt.verify(token, authSecret, function (err, decoded) {
      if (err) {
        return res.status(500).render("login", { message: "Failed to authenticate token." });
      } else {
        req.employee = decoded.employee;
        next();
      }
    });
  }
};

employeeController.verifyTokenAndRoleAdmin = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).render("login", { message: "No token provided." });
  } else {
    jwt.verify(token, authSecret, function (err, decoded) {
      if (err) {
        return res.status(500).render("login", { message: "Failed to authenticate token." });
      } else {
        Employee.findById(decoded.employee._id)
          .then(employee => {
            if (!employee) {
              return res.status(404).render("login", { message: "No employee found." });
            }
            if (employee.role !== "admin") {
              return res.status(403).render("login", { message: "Not authorized." });
            }
            req.employee = decoded.employee;
            next();
          })
          .catch(() => {
            return res.status(500).render("login", { message: "There was a problem finding the employee." });
          });
      }
    });
  }
};



module.exports = employeeController;
