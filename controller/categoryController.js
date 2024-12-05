const category = require("../models/CategoryModel")

// create new category
exports.addCategory = async (req, res)=>{
    let newCategory = await category.create({
        category_name: req.body.category_name
    })

    if(!newCategory){
        return res.status(400).json({error: "Something went wrong"})
    }
    
    return res.status(200).json({newCategory})
}

// get all categories
exports.getAllCategories = async (req, res) => {
  let categories = await category.find()
  if(!categories){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(categories)
}
/*
req.body -> value is passed using body of a form / post, put, patch
req.params -> value is passed using url/get method
req.querry -> value is passed using url/get method

status:
        404 -> page not found
        400 -> bad request
        200 -> ok
        500 -> internal server error


*/


/*
*********************AI Corrected CODE***************
const Category = require("../models/CategoryModel");

// Create a new category
exports.addCategory = async (req, res) => {
  try {
    // Create a new category
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });

    // Respond with the created category
    return res.status(200).json({ success: true, data: newCategory });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    return res.status(400).json({ success: false, error: error.message });
  }
};
*/