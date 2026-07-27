const express = require("express");
const { getDashboardOverview } = require("../../Controllers/Server/dashboardController");


const dashboardRoutes =
    express.Router();


// =====================================================
// DASHBOARD API
// =====================================================

dashboardRoutes.get(
    "/overview",
    getDashboardOverview
);


module.exports =
    dashboardRoutes;