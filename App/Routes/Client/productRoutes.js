const express = require("express");
const { getProductsByCategory, getSingleProduct, searchProducts, getAllBrands } = require("../../Controllers/Client/productController");

const productRoutes = express.Router();

// Product Listing
productRoutes.get(
    "/:menuName/:subCategory/:productCategory",
    getProductsByCategory
);

// Product Details
productRoutes.get(
    "/details/:id",
    getSingleProduct
);

productRoutes.get(
    "/search",
    searchProducts
);

productRoutes.get(
    "/brands",
    getAllBrands
);


module.exports = productRoutes;