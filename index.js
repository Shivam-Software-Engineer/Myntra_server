require('dotenv').config()
let express = require('express')
let mongoose = require('mongoose')
let App = express()
let cors = require('cors')
const bcrypt = require('bcrypt');
const { webRoutes } = require('./App/Routes/webRoutes')
const { adminRoutes } = require('./App/Routes/adminRoutes')
const { connectDB } = require('./App/Configurations/dbConfig')
const { adminLoginModel } = require('./App/Models/Server/adminModel')
const saltRounds = 10;


App.use(cors())
App.use(express.json())

// http://localhost:8080/web
App.use("/web", webRoutes)

// http://localhost:8080/admin
App.use("/admin", adminRoutes)


const startServer = async () => {
    try {
    // MongoDB Connect
    await connectDB();

    const hashAdmin = bcrypt.hashSync(process.env.ADMINPASS, saltRounds);

    // Check Admin
    const checkAdmin = await adminLoginModel.findOne();

    if (!checkAdmin) {
      await adminLoginModel.create({
        uname: process.env.ADMINUNAME,
        pass: hashAdmin,
      });

      console.log("Default Admin Created");
    }

    // Start Server
    const PORT = process.env.PORT || 8000;

    App.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } 

  catch (err) {
    console.log("Server Startup Error:", err.message);
    process.exit(1);
  }
};

startServer();