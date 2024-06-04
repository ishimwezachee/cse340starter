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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inv", {
    title: "Inventory Management",
    nav,
    errors:null,
    classificationSelect
  })
}

  /* ****************************************
*  Deliver new vehicle view
* *************************************** */
invCont.newVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationListHTML = await utilities.buildClassificationList();
  res.render("inv/new_vehicle", {
    title: "Add new vehicle",
    nav,
    classificationListHTML,
    errors:null,
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
*  Add Vehicle  
* *************************************** */
invCont.createVehicle = async function(req, res) {
  let nav = await utilities.getNav();
  const classificationListHTML = await utilities.buildClassificationList();
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
  const invImage = utilities.decodeHTML(inv_image);
  const invThumbnail = utilities.decodeHTML(inv_thumbnail);
  const result = await invModel.addNewVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      invImage,
      invThumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

  if (result) {
    req.flash(
      "notice",
      `Vehicle ${inv_make} ${inv_model} added successfully.`
    );
    res.status(201).render("inv/new_vehicle", {
      title: "Add new vehicle",
      nav,
      classificationListHTML,
      errors:null,
    })
  } else {
    req.flash("notice", "Sorry, the addition of the vehicle failed.");
    res.status(500).render("inv/new_vehicle", {
      title: "Add new vehicle",
      nav,
      classificationListHTML,
      errors:null,
    })
  }
};


/* ****************************************
*  Add classification  
* *************************************** */
invCont.createClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);
  if (result) {
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
    res.status(501).render("inv/new_class", {
      title: "Vehicle Management",
      nav,
    })
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemDetail(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inv/edit", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Deliver Inventory Delete Confirmation View
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inv_id = req.params.invent_id;
  const itemData = await invModel.getItemDetail(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inv/delete", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  });
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.  deleteInventoryItem(inv_id);
 
  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("error", "Sorry, the delete failed.");
    res.status(501).redirect(`/inv/delete/${inv_id}`);
  }
}

module.exports = invCont;
