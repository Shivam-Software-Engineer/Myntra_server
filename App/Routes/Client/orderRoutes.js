const express = require("express");

const Middleware = require("../../Middleware/Middleware");

const {

    createOrder,

    verifyOrder,

    getOrders,

    getOrderById,

    cancelOrder,

    trackOrder,

    downloadInvoice

} = require("../../Controllers/Client/orderController");

const orderRoutes = express.Router();

orderRoutes.post(
    "/create",
    Middleware,
    createOrder
);

orderRoutes.post(
    "/verify",
    Middleware,
    verifyOrder
);

orderRoutes.get(
    "/",
    Middleware,
    getOrders
);

orderRoutes.get(
    "/:id",
    Middleware,
    getOrderById
);

orderRoutes.patch(
    "/:id/cancel",
    Middleware,
    cancelOrder
);

orderRoutes.get(
    "/:id/track",
    Middleware,
    trackOrder
);

orderRoutes.get(
    "/:id/invoice",
    Middleware,
    downloadInvoice
);

module.exports = orderRoutes;