const express = require("express")
const { testFunction } = require("../controller/textController")
const router = express.Router()
// const router = require("express").Router;



router.get('/test', testFunction)

module.exports = router