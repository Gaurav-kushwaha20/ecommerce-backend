const product = require("../models/productModel")
const fs = require("fs");

// add product
exports.addProduct = async (req, res) => {
    // if(!req.file){
    //     return res.status(400).json({error: "Please upload a file"})
    // }

    let productToAdd = await product.create({
        product_name: req.body.product_name,
        category: req.body.category,
        product_price: req.body.product_price,
        description: req.body.description,
        // description: req.body.description?req.body.description:"",       // for the optional field, using ternery operator       
        count_in_stock: req.body.count_in_stock,
        product_image: req.file?.path
    })
    if (!productToAdd) {
        return res.status(400).json({ message: "Failed to add product" })
    }
    return res.status(201).json({ message: "Product added successfully", product: productToAdd })
}

// 
exports.getAllProducts = async (req, res) => {
    let products = await product.find().populate("category")
    if (!products) {
        return res.status(400).json({ message: "No products found" })
    }
    res.send(products)
}

// get aproduct details
exports.getProductDetails = async (req, res) => {
    let getProductDetails = await product.findById(req.params.id).populate("category", "category_name")
    if (!getProductDetails) {
        return res.status(400).json({ message: "Product not found" })
    }
    res.send(getProductDetails)
}
// ai corrected codes
// exports.getProductDetail = async (req, res) => {
//     try {
//         const productDetails = await product
//             .findById(req.params.id)
//             .populate('category', 'category_name')
//             .lean();

//         if (!productDetails) {
//             return res.status(404).json({ // Changed from 400 to 404 for "Not Found"
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: productDetails
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error retrieving product details",
//             error: error.message
//         });
//     }
// } 




// get product by cateogry
exports.getProductByCategory = async (req, res) => {
    let getProducts = await product.find({ category: req.params.category_id })
    if (!getProducts) {
        return res.status(400).json({ message: "No products found in this category" })
    }
    res.send(getProducts)
}


// update product
exports.updateProduct = async (req, res) => {
    let productToUpdate
    if (req.file) {
        productToUpdate = await product.findById(req.params.id)
        if(productToUpdate.product_image){
            fs.unlink(productToUpdate.product_image, ()=>{})
        }
        productToUpdate = await product.findByIdAndUpdate(req.params.id, {
            product_name: req.body.product_name,
            category: req.body.category,
            product_price: req.body.product_price,
            description: req.body.description,
            count_in_stock: req.body.count_in_stock,
            rating: req.body.rating,
            product_image: req.file.path
        }, { new: true })
    }
    else {
        productToUpdate = await productroduct.findByIdAndUpdate(req.params.id, {
            product_name: req.body.product_name,
            category: req.body.category,
            product_price: req.body.product_price,
            description: req.body.description,
            count_in_stock: req.body.count_in_stock,
            rating: req.body.rating
        }, { new: true })
    }

    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToUpdate)

}

// delete product
exports.deleteProduct = (req, res) => {
    product.findByIdAndDelete(req.params.id)
        .then(deleted => {
            if (!deleted) {
                return res.status(400).json({ message: "Product not found" })
            } else {
                fs.unlink(deleted.product_image, (error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Product image deleted")
                    }
                })
                res.send({ message: "Product deleted successfully" })
            }
        })
        .catch(error => {
            res.status(400).json({ message: "Failed to delete product " + error.message })
        })
}