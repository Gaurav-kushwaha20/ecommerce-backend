const { placeOrder, getAllOrders, getOrderDetails, getOrderByUser, deleteOrder } = require("../controller/orderController")

const router = require("express").Router()
router.post('/placeorder', placeOrder)
router.get('/getallorder', getAllOrders)
router.get('/getorderdetails/:id', getOrderDetails)
router.get('/getorderbyuser/:id', getOrderByUser)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router