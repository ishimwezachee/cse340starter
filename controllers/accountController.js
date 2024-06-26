  const jwt = require("jsonwebtoken");
  const bcrypt = require('bcrypt');
  require("dotenv").config();
  const utilities = require("../utilities");
  const accountModel = require("../models/account-model");


  /* ****************************************
  *  Deliver login view
  * *************************************** */
  async function buildLogin(req, res, next) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        title: "Login",
        nav,
        errors:null
      })
    }

    /* ****************************************
  *  Deliver registration view
  * *************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors:null,
    })
  }

  async function buildManagement (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account", {
      title: "Account Management",
      nav,
      errors:null,
    })
  }

  /* ****************************************
  *  Process Registration
  * *************************************** */
  async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(account_password, saltRounds);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors:null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors:null,
      })
    }
  }


  /* ****************************************
  *  Process login request
  * ************************************ */
  async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email);
    console.log(accountData)
    if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
    }
    try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV == "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      res.render("account", {
        title: "Account Management",
        nav,
        errors:null
      })
    }
    } catch (error) {
    return new Error('Access Forbidden')
    }
  }

  /* ****************************************
 *  Fetch user profile by account ID
 * ************************************ */
async function getUserProfile(req, res) {
  let nav = await utilities.getNav();
  const userId = req.params.user_id; 
  console.log(userId,"......")
  try {
    const profileDataModel = await accountModel.getUserProfile(userId);
    const profileData = utilities.profileView(profileDataModel)
    if (profileDataModel) {
      res.status(200).render("account/profile", {
        title: "User Profile",
        nav,
        profileData,
        errors: null
      });
    } else {
      req.flash("notice", "Profile not found.");
      res.status(404).render("account", {
        title: "Account Management",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    req.flash("notice", "An error occurred while fetching the profile.");
    res.status(500).render("account", {
      title: "Account Management",
      nav,
      errors: null,
    });
  }
}


    
  module.exports = { buildLogin, buildRegister,registerAccount,accountLogin,buildManagement,getUserProfile}