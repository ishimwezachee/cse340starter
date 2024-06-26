const invModel = require("../models/inventory-model")
const accModel  = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.decodeHTML = function (text) {
  const entities = {
    '&#x2F;': '/',
    '&#x27;': "'",
    '&#x22;': '"',
    '&#x3C;': '<',
    '&#x3E;': '>',
    '&#x26;': '&',
  };

  return text.replace(/&#(\w+);/g, function (match, dec) {
    if (entities.hasOwnProperty(match)) {
      return entities[match];
    } else {
      return String.fromCharCode(parseInt(dec, 10));
    }
  });
};




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Catch the errors 
* ************************************ */
Util.handleErrors = function (fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log(err)
      next(err);
    }
  };
}
// Util. use = fn => (req,res,next)=> Promise.resolve(fn(req,res,next)).catch(next);

/* **************************************
 * Build HTML markup for displaying vehicle details
 * ************************************ */
Util.getDetailsHTML = function(vehicle) {
  let detailsHTML = "<div class='vehicle-details'>";

  detailsHTML += `
        <div class="container">
            <div class="image-container">
                <div class="badge">This vehicle has passed inspection by an ASE-certified technician.</div>
                <img src=${vehicle.inv_image} alt="Vehicle Image">
                <div class="thumbnail-container">
                    <img src=${vehicle.inv_thumbnail}  alt="Thumbnail 1">
                    <img src=${vehicle.inv_thumbnail} alt="Thumbnail 2">
                    <img src=${vehicle.inv_thumbnail} alt="Thumbnail 3">
                    <img src=${vehicle.inv_thumbnail} alt="Thumbnail 4">
                </div>
            </div>
            <div class="details-container">
                <h2>2019 Nissan Sentra SV CVT</h2>
                <div class="title_details">
                  <div class="one">
                    <h3>MILEAGE</h3>
                    <h3>74,750</h3>
                  </div>
                  <div class="two">
                    <h2>No-Haggle Price</h2>
                  </div>
                  <div class="three">
                    <h1>16,99</h1>
                    <p>Do not include the document service</p>
                    <h3 class="estimate">ESTIMATE PAYMENTS</h3>
                  </div>
                </div>
                <div class="parent_details">
                  <div class="details">
                    <p>No-Haggle Price:${vehicle.inv_price}</p>
                    <p>maker : ${vehicle.inv_make}</p>
                    <p>MPG: 27/37 (City/Hwy)</p>
                    <p>Ext. Color: ${vehicle.inv_color}</p>
                    <p>Fuel Type: Gasoline</p>
                    <p>Drivetrain: Front Wheel Drive</p>
                    <p>Year: ${vehicle.inv_year}</p>
                    <p>Stock #: TR7799</p>
                    <p>miles: ${vehicle.miles}</p>
                    <p>The principal prior use of this vehicle was as a personal vehicle.</p>
                    <br>
                    <h3 class="mpg">+MPG</h3>
                    <p>This principal prior use of the vehicle was as Rental service</p>
                   </div>
                   <div class="button_items">
                    <button class="button" id="star">Start My purchase</button>
                    <button class="start">CONTACT US</button>
                    <button class="start">SCHEDULE TEST Drive</button>
                    <button class="start">APPLY FOR FINANCING</button>
                    <br>
                    <h2>Call us</h2>
                    <h2 class="mpg">801-396-7886</h2>
                    <h2>Visit Us</h2>
                   </div>
                </div>
            </div>
        </div>
  `;
  detailsHTML += "</div>";
  return detailsHTML;
};



Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          res.locals.isLoggedIn = false;
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        res.locals.isLoggedIn = true;
        res.locals.user_id = accountData.account_id; 
        next();
      }
    );
  } else {
    res.locals.isLoggedIn = false;
    next();
  }
};


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
* Middleware to check token validity and account type
**************************************** */
Util.checkJWTAndAccountType = async (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          res.locals.isLoggedIn = false; 
          return res.redirect("/account/login")
        }
        const accountType = await accModel.getAccountType(accountData.account_id); // Assuming you have a function to retrieve the account type from the database
        if (accountType !== "Employee" && accountType !== "Admin") {
          req.flash("notice", "You do not have permission to access this resource.");
          return res.redirect("/");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        res.locals.isLoggedIn = true;
        next();
      });
  } else {
    res.locals.isLoggedIn = false; 
    next();
  }
}


Util.profileView = function(profileData) {
  let profileHtml = "<div class='profile-container'>";
  profileHtml += "<div class='profile-info'>";
  profileHtml += "<h3 class='profile-name'>" + profileData.account_firstname + " " + profileData.account_lastname + "</h3>";
  profileHtml += "<p class='profile-email'><strong>Email:</strong> " + profileData.account_email + "</p>";
  profileHtml += "<p class='profile-type'><strong>Account Type:</strong> " + profileData.account_type + "</p>";
  profileHtml += "</div>";
  profileHtml += "</div>";
  return profileHtml;
};


module.exports = Util;


module.exports = Util;


