const utilities = require(".")
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

module.exports = validate