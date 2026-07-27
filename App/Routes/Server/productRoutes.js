let express = require('express')
const { addProduct, viewProduct, getProductCategoryBySubCategory, viewSingleProduct, updateProduct } = require('../../Controllers/Server/productController')

let productRoutes = express.Router()

// http://localhost:8080/admin/product/add
productRoutes.post("/add", addProduct)

// http://localhost:8080/admin/product/view
productRoutes.get("/view", viewProduct)

// http://localhost:8080/admin/product/view-productcategory/:subCateId
productRoutes.get("/view-productcategory/:subCateId", getProductCategoryBySubCategory)

// http://localhost:8080/admin/product/view/:id
productRoutes.get("/view/:id", viewSingleProduct)

// http://localhost:8080/admin/product/update/:id
productRoutes.put("/update/:id", updateProduct)

// // http://localhost:8080/admin/product/view-subcategory/:parentId
// productRoutes.get("/view-subcategory/:parentId", getSubCategoryByParent)

// // http://localhost:8080/admin/product/update-status/:id
// productRoutes.put("/update-status/:id", updateProductCategoryStatus)


// // http://localhost:8080/admin/product/update/:id
// productRoutes.put("/update/:id", updateProductCategory)

// // http://localhost:8080/admin/product/delete
// productRoutes.post("/delete", deleteProductCategory)

module.exports = {productRoutes}