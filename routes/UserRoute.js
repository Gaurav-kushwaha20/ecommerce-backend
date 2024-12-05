const express = require('express');
const router = express.Router();
const { register, verifyEmail, forgotPassword, resetPassword, resendVerification, userlist, userdetails, updateuser, updateusernameandemail, login, signout } = require('../controller/userController');
const { userRules, validationScript } = require('../middlewares/validationScript');

router.post('/register', userRules, validationScript, register)
router.get('/verify/:token', verifyEmail)
router.post('/forgotpassword', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post("/re-verify/:email", resendVerification)
router.get('/getuserlist', userlist)
router.get('/userdetails/:id/:email', userdetails)
router.post('/updateuser/:id', updateuser)
router.post('/updateusernameandemail/:id', updateusernameandemail)
router.post('/login', login)
router.post('/signout', signout)


module.exports = router;