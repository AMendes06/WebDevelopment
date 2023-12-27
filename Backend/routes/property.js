var express = require("express");
var router = express.Router();
var multer = require("multer");
var propertyController = require("../controllers/propertyController");
var employeeController = require("../controllers/employeeController");
var Property = require("../models/propertyModel");

const destination = 'public/images/test'
const filename = (req, file, cb) => cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)

const allowedImagesExts = ['jpg', 'png', 'gif', 'jpeg', 'jfif']
const fileFilter = (req, file, cb) =>
  cb(null, allowedImagesExts.includes(file.originalname.split('.').pop()))

const storage = multer.diskStorage({ destination, filename })
const upload = multer({ storage, fileFilter })


router.post("/createProperty", employeeController.verifyTokenAndRoleAdmin, upload.single("image"), propertyController.createProperty);
router.get('/deleteProperty/:id', employeeController.verifyTokenAndRoleAdmin, propertyController.deleteProperty);
router.post('/refactorProperty/:id', employeeController.verifyTokenAndRoleAdmin, propertyController.updateProperty);

router.get("/property", employeeController.verifyToken, propertyController.getAllProperties, async (req, res) => {
  const token = req.cookies.token;
  res.render("property", { token });
});

router.get('/createProperty', employeeController.verifyTokenAndRoleAdmin, (req, res, next) => {
  const token = req.cookies.token;
  res.render('addProperty', { token });
});

router.get("/refactorProperty/:id", employeeController.verifyTokenAndRoleAdmin, async (req, res) => {
  const property = await Property.findById(req.params.id);
  const token = req.cookies.token;
  res.render('refactorProperty', { property, token });
});

router.get("/detailProperty/:id", employeeController.verifyToken, async (req, res) => {
  const property = await Property.findById(req.params.id);
  const token = req.cookies.token;
  res.render('propertyDetail', { property, token });
});

module.exports = router;