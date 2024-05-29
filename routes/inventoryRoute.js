const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inv-validation");

// Route to build inventory by classification view
router.get("/", invController.invetoryForm);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:itemId", invController.buildItemDetail);
router.get("/", invController.invetoryForm);

router.get("/new_class", invController.newClassification);
router.get("/new_vehicle", invController.newVehicle);
router.post(
    "/new_class",
    validate.addClassRules(),
    validate.checkAddClassData,
    utilities.handleErrors(invController.createClassification)
);

router.post(
    "/new_vehicle",
    validate.addVehicleRules(),
    validate.checkAddVehicleData,
    utilities.handleErrors(invController.createVehicle)
)

module.exports = router;