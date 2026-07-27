let express = require('express')
const { adminAuthRoutes } = require('./Server/adminAuthRoutes')
const { categoryRoutes } = require('./Server/categoryRoutes')
const { subCategoryRoutes } = require('./Server/subCategoryRoutes')
const { productCategoryRoutes } = require('./Server/productCategoryRoutes')
const { productRoutes } = require('./Server/productRoutes')
const { userRoutes } = require('./Server/userRoutes')
const { orderRoutes } = require('./Server/orderRoutes')
const dashboardRoutes = require('./Server/dashboardRoutes')
let adminRoutes = express.Router()

// http://localhost:8080/admin/auth
adminRoutes.use("/auth", adminAuthRoutes)

// http://localhost:8080/admin/category
adminRoutes.use("/category", categoryRoutes)

// http://localhost:8080/admin/subcategory
adminRoutes.use("/subcategory", subCategoryRoutes)

// http://localhost:8080/admin/productcategory
adminRoutes.use("/productcategory", productCategoryRoutes)

// http://localhost:8080/admin/product
adminRoutes.use("/product", productRoutes)

adminRoutes.use("/user", userRoutes)

adminRoutes.use("/order", orderRoutes)

adminRoutes.use('/dashboard', dashboardRoutes)

module.exports = {adminRoutes}