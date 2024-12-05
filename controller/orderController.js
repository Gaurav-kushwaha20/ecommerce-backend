const Order = require("../models/OrderModel")
const OrderItems = require("../models/OrderItemsModel")




// place order
exports.placeOrder = async (req, res) => {


    let orderItems = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let orderItemToAdd = await OrderItems.create({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            if (!orderItemToAdd) {
                return res.status(400).json({ error: "something went wrong" })
            }
            return orderItemToAdd._id
        })
    )

    let individual_total = await Promise.all(
        orderItems.map(async orderItem => {
            let orderItemAdded = await OrderItems.findById(orderItem).populate('product', 'product_price')
            return orderItemAdded.quantity * orderItemAdded.product.product_price
        })
    )

    let total = individual_total.reduce((a, b) => a + b)
    let orderToPlace = await Order.create({
        orderItems,
        total,
        user: req.body.user,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone,
        postal_code: req.body.postal_code

    })

    if (!orderToPlace) {
        return res.status(400).json({ error: "failed to place order" })
    }
    res.send(orderToPlace)
}
// get all order
exports.getAllOrders = async (req, res) => {
    let order = await Order.find()
    if (!order) {
        return res.send(400).json({ error: "order not found" })
    }
    res.send(order)
}

// get order details
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.id)
    if (!order) {
        return res.status(404).json({ error: "order not found" })
    }
    res.send(order)
}

exports.getOrderByUser = async (req, res) => {
    // let orders = await Order.find({ user: req.params.id }).populate('user', 'username')
    let orders = await Order.find({ user: req.params.id }).populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(404).json({ error: "no orders found" })
    }
    res.send(orders)
}

// delete order
exports.deleteOrder = (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(404).json({ error: "order not found" })
            }
            order.orderItem.map((ORDERITEM) => {
                OrderItems.findByIdAndDelete(ORDERITEM)
                    .then(orderItem => {
                        if (!orderItem) {
                            return res.status(404).json({ error: "order item not found" })
                        }
                    })
                    .catch(error => console.log(error))
            })
            res.send({ message: "order deleted successfully" })
        })
        .catch(error => console.log(error))


}