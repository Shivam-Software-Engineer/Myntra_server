let express = require('express')
const { viewOrders, deletOrders } = require('../../Controllers/Server/orderController')

let orderRoutes = express.Router()


// http://localhost:8080/admin/category/view
orderRoutes.get("/view", viewOrders)

orderRoutes.post("/delete", deletOrders)


module.exports = {orderRoutes}