const express = require("express")
require('dotenv').config();
const app = express()
const cors = require('cors')
const TestRoute = require('./routes/testRoute');
const categoryRoute = require('./routes/CategoryRoute')
const productRoute = require("./routes/productRoute")
const UserRoute = require('./routes/UserRoute')
const orderRoute = require("./routes/orderRoute")
require("./database/connection")

const port = process.env.PORT
// app.get(end-point, function(req, res))
app.use(cors())
app.use(express.json())
app.use(categoryRoute);
app.use(TestRoute)
app.use(productRoute)
app.use(UserRoute)
app.use(orderRoute)


// app.use('/public/uploads', express.static("public/uploads"))
app.get('/hello', (request, response) => {
    response.send("Hi there everything ok!")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})