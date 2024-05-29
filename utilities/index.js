const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data.rows)
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



module.exports = Util