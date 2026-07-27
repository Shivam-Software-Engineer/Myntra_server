const userModel = require("../../Models/Cleint/userModel");

let viewUser = async (req, res) => {
    try {
        let users = await userModel.find()

        res.send({
            status: 1,
            message: "Users Retrieved Successfully",
            users
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }

}


let deletUser = async (req, res) => {
    let {ids} = req.body;
    try {
        let deleteUser = await userModel.deleteMany(
            { _id: { $in: ids } }
        );

        res.send({
            status: 1,
            message: "Users Deleted Successfully",
            deleteUser
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

module.exports = { viewUser , deletUser}