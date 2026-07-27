const express = require("express");
const menuRoutes = require("./Client/menuRoutes");
const productRoutes = require("./Client/productRoutes");
const { clientAuthRoutes } = require("./Client/authRoutes");
const cartRoutes = require("./Client/cartRoutes");
const orderRoutes = require("./Client/orderRoutes");

const webRoutes = express.Router();


// http://localhost:8080/web/menu
webRoutes.use("/menu", menuRoutes);

// http://localhost:8080/web/products
webRoutes.use("/products", productRoutes);

webRoutes.use("/auth",clientAuthRoutes)

webRoutes.use("/cart",cartRoutes)
webRoutes.use("/order",orderRoutes)

module.exports = { webRoutes };