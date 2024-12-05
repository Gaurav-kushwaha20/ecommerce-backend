const router = require('express').Router()
const { validationResult } = require('express-validator');
const { addCategory, getAllCategories } = require('../controller/categoryController');
const { requireUser, requireAdmin } = require('../controller/userController');
const { categoryRules, validationScript } = require('../middlewares/validationScript');

// router.post('/addcategory', requireUser, addCategory)
router.post('/addcategory', requireAdmin, categoryRules, validationScript, addCategory)
router.get('/getallcategories', getAllCategories)

module.exports = router;