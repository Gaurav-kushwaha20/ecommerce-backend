const { check, validationResult } = require("express-validator")

exports.categoryRules = [
    check('category_name', "category is reqyired").notEmpty()
        .isLength({ min: 3 }).withMessage("category must be at least 3 characters")
        .matches(/[a-zA-z]/).withMessage("category must only be alphabets")
]

exports.validationScript = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

exports.productRules = [
    check('product_name', 'product name is required').notEmpty()
        .isLength({ min: 3 }).withMessage('product name must be at least'),
    check('product_price', "product price is required").notEmpty()
        .isNumeric().withMessage("price must be a number"),
    check('product_description', "product description is required").notEmpty()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
    check('count_in_stock', "count is required").notEmpty()
        .isNumeric().withMessage("count must be a number"),
    check('category', "category is required").notEmpty()
        .matches(/^[0-9a-f]{24}$/).withMessage("invalid category")
]

exports.userRules = [
    check('username', "username is required").notEmpty()
        .isLength({ min: 3 }).withMessage("username must be at least 3")
        .matches(/[a-zA-z1-9]/).withMessage("username must only be alpha numeric")
        .not().isIn(['god', 'dog', 'admin', 'user']).withMessage("username is not allowed"),
    check('email', "email is required").notEmpty()
        .isEmail().withMessage("email must be a valid email"),
    check('password', "password is required").notEmpty()
        .isLength({ min: 8 }).withMessage("password must be at least 8")
        .isLength({ max: 20 }).withMessage("password must be less than 20")
        .matches(/[a-z]/).withMessage("password must contain lowercase")
        .matches(/[A-Z]/).withMessage("password must contain uppercase")
        .matches(/[0-9]/).withMessage("password must contain number"),

]