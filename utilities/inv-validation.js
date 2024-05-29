const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

  /*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
  validate.addClassRules = ()=>{
    return [
        // classification name is required and must be a string 
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha() 
            .isLength({ min: 2 })
            .withMessage("Please provide a valid classification name with alphabetic characters only.")
    ]
  }
    /* ******************************
 * Check data and return errors or continue to add classification 
 * ***************************** */

validate.checkAddClassData = async (req,res,next)=>{
    const {classification_name}  = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("inv/new_class",{
            errors,
            title:"Add New Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

/*  **********************************
  *  Vehicle Data Validation Rules
  * ********************************* */
validate.addVehicleRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make with at least 3 characters."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model with at least 3 characters."),
    body("inv_year")
      .isInt({ min: 1886 }) 
      .withMessage("Please provide a valid year."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an image URL."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a thumbnail URL."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add vehicle 
 * ***************************** */
validate.checkAddVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationListHTML = await utilities.buildClassificationList(classification_id);
    res.render("inv/new_vehicle", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationListHTML,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};

module.exports = validate;
