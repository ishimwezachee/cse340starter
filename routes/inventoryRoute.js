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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editInventoryView));
router.post("/edit/", validate.updateDataRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:invent_id", utilities.handleErrors(invController.buildDeleteView));
router.post("/delete", utilities.handleErrors(invController.deleteInventory));
module.exports = router;