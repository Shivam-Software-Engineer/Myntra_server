const { orderModel } = require("../../Models/Cleint/orderModel");

let viewOrders = async (req, res) => {
    try {
        let users = await orderModel.find().populate('user')

        res.send({
            status: 1,
            message: "Orders Retrieved Successfully",
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




let deletOrders = async (req, res) => {
    let {ids} = req.body;
    try {
        let deleteOrder = await orderModel.deleteMany(
            { _id: { $in: ids } }
        );

        res.send({
            status: 1,
            message: "Orders Deleted Successfully",
            deleteOrder
        });
    } 
    catch (error) {
        res.send({
            status: 0,
            message: error.message,
        });
    }
}

module.exports = { viewOrders , deletOrders}