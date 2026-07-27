const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        // ==========================================
        // USER REFERENCE
        // ==========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },


        // ==========================================
        // PRODUCT REFERENCE
        // ==========================================

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },


        // ==========================================
        // PRODUCT DETAILS
        // ==========================================

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        productImage: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
            trim: true,
        },


        // ==========================================
        // PRICE DETAILS
        // ==========================================

        mrpPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },


        // ==========================================
        // SELECTED SIZE
        // ==========================================

        size: {
            type: String,
            default: "",
        },


        // ==========================================
        // SELECTED COLOR
        // ==========================================

        color: {
            type: String,
            default: "",
        },


        // ==========================================
        // QUANTITY
        // ==========================================

        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },

    },

    {
        timestamps: true,
    }
);


const cartModel = mongoose.model(
    "cart",
    cartSchema,
    "cart"
);


module.exports = {
    cartModel
};