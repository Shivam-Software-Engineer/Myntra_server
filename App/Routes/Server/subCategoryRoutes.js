let express = require('express')
const { addSubCategory, viewSubCategory, viewParentCategory, updateSubCategoryStatus, deleteSubCategory, updateSubCategory, viewSingleSubCategory } = require('../../Controllers/Server/subCategoryController')

let subCategoryRoutes = express.Router()

// http://localhost:8080/admin/subcategory/add
subCategoryRoutes.post("/add", addSubCategory)

// http://localhost:8080/admin/subcategory/view
subCategoryRoutes.get("/view", viewSubCategory)

// http://localhost:8080/admin/subcategory/view/:id
subCategoryRoutes.get("/view/:id", viewSingleSubCategory)

// http://localhost:8080/admin/subcategory/parent-category
subCategoryRoutes.get("/parent-category", viewParentCategory)

// http://localhost:8080/admin/subcategory/update-status/:id
subCategoryRoutes.put("/update-status/:id", updateSubCategoryStatus)

// http://localhost:8080/admin/subcategory/update/:id
subCategoryRoutes.put("/update/:id", updateSubCategory)

// http://localhost:8080/admin/subcategory/delete
subCategoryRoutes.post("/delete", deleteSubCategory)

module.exports = {subCategoryRoutes}