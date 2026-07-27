let mongoose = require("mongoose");

let adminLoginSchema = mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    
})


let adminLoginModel = mongoose.model("admin", adminLoginSchema, "admin");
module.exports={adminLoginModel};