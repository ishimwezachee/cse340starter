const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory details view
 * ************************** */

invCont.buildItemDetail = async function (req, res, next) {
  try {
    const itemId = req.params.itemId;
    let nav = await utilities.getNav()
    const itemDetail = await invModel.getItemDetail(itemId);
    const detail = await utilities.getDetailsHTML(itemDetail);
    const name = itemDetail.inv_make
    res.render('./inventory/detail',{
      title:name,
      nav,
      detail
    })
  } catch (error) {
    next(error); 
  }
};

  /* ****************************************
*  Deliver create inventory view
* *************************************** */
invCont.invetoryForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inv", {
    title: "Vehicle Management",
    nav,
  })
}

  /* ****************************************
*  Deliver new vehicle view
* *************************************** */
invCont.newVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inv/new_vehicle", {
    title: "Add new vehicle",
    nav,
  })
}

  /* ****************************************
*  Deliver new classification view
* *************************************** */
invCont.newClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inv/new_class", {
    title: "Add New Classification",
    nav,
    errors:null,
  })
}

/* ****************************************
*  Process classification creation 
* *************************************** */
invCont.createClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.registerClassification(classification_name);
  if (regResult) {
    req.flash(
      "notice",
      `Classification '${classification_name}' has been successfully created.`
    );
    res.status(201).render("inv/new_class", {
      title: "Add New Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification creation failed.");
    res.status(501).render("inv", {
      title: "Vehicle Management",
      nav,
    })
  }
};

module.exports = invCont;
