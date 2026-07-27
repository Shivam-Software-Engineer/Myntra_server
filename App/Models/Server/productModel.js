const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // Product Name
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // Product Image
        image: {
            type: String,
            required: true,
        },

        // Parent Category
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },

        // Sub Category
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
            required: true,
        },

        // Product Category
        productCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productcategory",
            required: true,
        },

        // Brand Name
        brand: {
            type: String,
            required: true,
            trim: true,
        },

        // MRP Price
        mrpPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // Selling Price
        sellingPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // Discount Percentage
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        // Stock Quantity
        stock: {
            type: Number,
            required: true,
            default: 0,
        },

        // Product Description
        description: {
            type: String,
            required: true,
            trim: true,
        },

        // Fabric / Material
        fabric: {
            type: String,
            trim: true,
            default: "",
        },

        // Available Sizes
        sizes: {
            type: [String],
            default: [],
        },

        // Available Colors
        colors: {
            type: [String],
            default: [],
        },

        // Fit
        fit: {
            type: String,
            default: "",
        },
        slug: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },

        // Sleeve
        sleeve: {
            type: String,
            default: "",
        },

        // Neck Type
        neck: {
            type: String,
            default: "",
        },

        // Pattern
        pattern: {
            type: String,
            default: "",
        },

        // Occasion
        occasion: {
            type: String,
            default: "",
        },

        // Wash Care
        washCare: {
            type: String,
            default: "",
        },

        // Country Of Origin
        countryOfOrigin: {
            type: String,
            default: "India",
        },

        // Product Status
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const productModel = mongoose.model(
    "product",
    productSchema,
    "product"
);

module.exports = { productModel };