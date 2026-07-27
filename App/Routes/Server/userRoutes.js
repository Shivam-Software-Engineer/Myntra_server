let express = require('express')
const { viewUser, deletUser } = require('../../Controllers/Server/userController')

let userRoutes = express.Router()


// http://localhost:8080/admin/category/view
userRoutes.get("/view", viewUser)

userRoutes.post("/delete", deletUser)


module.exports = {userRoutes}