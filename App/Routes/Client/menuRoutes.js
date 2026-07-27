const express = require("express");
const { getMenuData } = require("../../Controllers/Client/menuController");


const menuRoutes = express.Router();

// http://localhost:8080/web/menu/Men
// http://localhost:8080/web/menu/Women
// http://localhost:8080/web/menu/Kids

menuRoutes.get("/:menuName", getMenuData);

module.exports = menuRoutes;