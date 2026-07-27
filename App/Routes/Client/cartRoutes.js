const express = require("express");

const {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCart,
} = require("../../Controllers/Client/cartController");

const Middleware =
    require("../../Middleware/Middleware");


const cartRoutes =
    express.Router();


// ==========================================
// ADD TO CART
// ==========================================

cartRoutes.post(
    "/add",
    Middleware,
    addToCart
);


// ==========================================
// REMOVE FROM CART
// ==========================================

cartRoutes.delete(
    "/remove",
    Middleware,
    removeFromCart
);


// ==========================================
// UPDATE CART QUANTITY
// ==========================================

cartRoutes.put(
    "/update",
    Middleware,
    updateCartQuantity
);


// ==========================================
// GET CART
// ==========================================

cartRoutes.get(
    "/",
    Middleware,
    getCart
);


module.exports =
    cartRoutes;