const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get item detail by item ID
 * ************************** */
async function getItemDetail(itemId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [itemId]
    );
    return data.rows[0]; 
  } catch (error) {
    console.error("getItemDetail error " + error);
    throw error; 
  }
}

/* *****************************
*   Register new classification 
* *************************** */
async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0];
  } catch (error) {
    console.error("registerClassification error " + error);
    throw error;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getItemDetail, registerClassification}
  