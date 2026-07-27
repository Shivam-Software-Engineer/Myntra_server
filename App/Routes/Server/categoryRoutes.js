let express = require('express')
const { addCategory, viewCategory, viewSingleCategory, updateCategory, updateCategoryStatus, deleteCategory } = require('../../Controllers/Server/categoryController')

let categoryRoutes = express.Router()

// http://localhost:8080/admin/category/add
categoryRoutes.post("/add", addCategory)

// http://localhost:8080/admin/category/view
categoryRoutes.get("/view", viewCategory)

// http://localhost:8080/admin/category/view
categoryRoutes.get("/view/:id", viewSingleCategory)

// http://localhost:8080/admin/category/update/:id
categoryRoutes.put("/update/:id", updateCategory)


// http://localhost:8080/admin/category/update-status/:id
categoryRoutes.put("/update-status/:id", updateCategoryStatus)

// http://localhost:8080/admin/category/delete
categoryRoutes.post("/delete", deleteCategory)

module.exports = {categoryRoutes}