var Client = require("../../models/clientModel");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { authSecret } = require("../../.env");

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

var authController = {};

authController.createUser = async (req, res, next) => {
  const { emailClient, password } = req.body;
  try {
    let clients = await Client.findOne({ emailClient });
    if (clients) {
      if (clients.password) {
        return res
          .status(400)
          .json("Email already registered with a password!");
      }
      clients.password = encryptPassword(password);
      await clients.save();
      res.status(200).json("User created successfully!");
    } else {
      clients = new Client({ ...req.body });
      clients.password = encryptPassword(password);
      await clients.save();
      const token = jwt.sign({ client: clients }, authSecret, {
        expiresIn: 84600,
      });
     // res.cookie("token", token, { maxAge: 86400, httpOnly: true });
      res.status(201).json({ auth: true, token: token });
    }
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }
};

authController.login = async (req, res, next) => {
  try {
    const client = await Client.findOne({ emailClient: req.body.emailClient });
    if (!client) {
      return res.status(400).json("User not found!");
    }
    const isMatch = bcrypt.compareSync(req.body.password, client.password);
    if (!isMatch) {
      return res.status(401).json("Invalid password!");
    }
    const token = jwt.sign({ client: client }, authSecret, {
      expiresIn: 84600,
    });
    //res.cookie("token", token, { maxAge: 86400, httpOnly: true });
    res.status(201).json({ auth: true, token: token });
  } catch (error) {
    return res.status(500).send("Something went wrong!");
  }
};

authController.verifyToken = function (req, res, next) {
  var token = req.headers["authorization"];
  if (!token)
    return res.status(403).send("No token provided. You should be loged." );

  token = token.replace("Bearer ", "");

  jwt.verify(token, authSecret, function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send("Failed to authenticate token.");

    req.userId = decoded.client.id; 
    next();
  });
};


module.exports = authController;