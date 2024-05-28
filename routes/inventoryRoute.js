const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/", invController.invetoryForm);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:itemId", invController.buildItemDetail);
router.get("/", invController.invetoryForm);

router.get("/new_class", invController.newClassification);
router.get("/new_vehicle", invController.newVehicle);

router.post("/new_class",invController.createClassification);
module.exports = router;