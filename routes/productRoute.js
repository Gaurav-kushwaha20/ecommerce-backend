const { addProduct, getAllProducts, getProductDetails, getProductByCategory, updateProduct, deleteProduct } = require('../controller/productController')
const upload = require('../middlewares/fileUpload')
const { productRules, validationScript } = require('../middlewares/validationScript')
const router = require("express").Router()

router.post('/addProduct', upload.single('product_image'), productRules, validationScript, addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/getproductdetails/:id', getProductDetails)
router.get("/getproductsbycategory/:category_id", getProductByCategory)
router.put("/updateproduct/:id", upload.single('product_image'), updateProduct)
router.delete("/deleteProduct/:id", deleteProduct)

module.exports = router;