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



module.exports = invCont