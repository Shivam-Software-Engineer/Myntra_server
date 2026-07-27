let express = require('express')
const { adminLogin } = require('../../Controllers/Server/adminAuthController')
let adminAuthRoutes = express.Router()

// http://localhost:8080/admin/auth/login
adminAuthRoutes.post("/login", adminLogin)

module.exports = {adminAuthRoutes}