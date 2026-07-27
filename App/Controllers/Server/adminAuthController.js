const { adminLoginModel } = require("../../Models/Server/adminModel");
const bcrypt = require('bcrypt');

let adminLogin = async (req, res) => {
    try {
        const { uname, pass } = req.body;

        // Username Check
        const admin = await adminLoginModel.findOne({ uname });

        if (!admin) {
            return res.status(401).json({
                status: 0,
                message: "Invalid Username",
            });
        }

        // Password Check
        const isMatch = bcrypt.compareSync(pass, admin.pass);

        if (!isMatch) {
            return res.status(401).json({
                status: 0,
                message: "Invalid Password",
            });
        }

        return res.status(200).json({
            status: 1,
            message: "Login Successful",
            data:admin._id
        });

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message,
        });
    }
};







module.exports = { adminLogin }