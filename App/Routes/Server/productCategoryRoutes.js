let express = require('express')
const { addProductCategory, viewProductCategory, updateProductCategory, viewSingleProductCategory, getSubCategoryByParent, updateProductCategoryStatus, deleteProductCategory } = require('../../Controllers/Server/productCategoryController')
const { updateSubCategoryStatus } = require('../../Controllers/Server/subCategoryController')

let productCategoryRoutes = express.Router()

// http://localhost:8080/admin/productcategory/add
productCategoryRoutes.post("/add", addProductCategory)

// http://localhost:8080/admin/productcategory/view
productCategoryRoutes.get("/view", viewProductCategory)

// http://localhost:8080/admin/productcategory/view/:id
productCategoryRoutes.get("/view/:id", viewSingleProductCategory)

// http://localhost:8080/admin/productcategory/view-subcategory/:parentId
productCategoryRoutes.get("/view-subcategory/:parentId", getSubCategoryByParent)

// http://localhost:8080/admin/productcategory/update-status/:id
productCategoryRoutes.put("/update-status/:id", updateProductCategoryStatus)


// http://localhost:8080/admin/productcategory/update/:id
productCategoryRoutes.put("/update/:id", updateProductCategory)

// http://localhost:8080/admin/productcategory/delete
productCategoryRoutes.post("/delete", deleteProductCategory)

module.exports = {productCategoryRoutes}