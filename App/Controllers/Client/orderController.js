
// ======================================================
// CREATE ORDER
// ======================================================
const crypto=require('crypto')
const { cartModel } = require("../../Models/Cleint/cartModel");
const { orderModel } = require("../../Models/Cleint/orderModel");
let Razorpay = require("razorpay")
var instance = new Razorpay({
    key_id:"rzp_test_TIAWhMSmwV24Ez",
    key_secret:"SmvIbx81agKLRVp8hgqDqayo"
})
const createOrder = async (req, res) => {
    try {

        // ==========================================
        // GET USER ID FROM JWT MIDDLEWARE
        // ==========================================

        const userId = req.user.userId || req.user.id || req.user._id;

        if (!userId) {
            return res.status(401).json({
                status: 0,
                message: "User ID not found in token",
            });
        }


        // ==========================================
        // GET DATA FROM FRONTEND
        // ==========================================

        const {
            items,
            quantity,
            orderAmount,
            shippingCharges,
            paymentMethod,
            shippingAddress
        } = req.body;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 0,
                message: "Order items are required",
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: 0,
                message: "Valid quantity is required",
            });
        }

        if (orderAmount === undefined || orderAmount < 0) {
            return res.status(400).json({
                status: 0,
                message: "Valid order amount is required",
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                status: 0,
                message: "Payment method is required",
            });
        }


        // ==========================================
        // PAYMENT METHOD VALIDATION
        // ==========================================

        if (!["COD", "ONLINE"].includes(paymentMethod)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid payment method",
            });
        }


        // ==========================================
        // ONLINE PAYMENT
        // ==========================================

        // Abhi online payment ka logic nahi lagana hai.
        // Tum baad mein Razorpay logic yaha add karoge.

        if (paymentMethod === "ONLINE") {

            let newOrder = await orderModel.create({

                user: userId,

                items: items,

                quantity: quantity,

                orderAmount: orderAmount,

                shippingCharges: shippingCharges || 0,

                paymentMethod: "ONLINE",

                paymentStatus: "PENDING",

                orderStatus: "PROCESSING",

                paymentStatus: "PENDING",
                shippingAddress

            });

            let orderId = newOrder._id

            let objR={
                "amount":orderAmount*100,
                "currency":"INR",
                "receipt":orderId
            }

            let orderRes = await instance.orders.create(objR)

            let updateOrderId = await orderModel.updateOne({_id:orderId},
                {$set:{
                    razorpayOrderId:orderRes.id
                }}
            )

            let resObj={
                name:shippingAddress.fullName,
                mobile:shippingAddress.mobile


            }

             res.status(200).json({
                status: 1,
                orderRes,
                data:resObj
                
            });
        }


        // ==========================================
        // COD ORDER
        // ==========================================

        if (paymentMethod === "COD") {

            // ==========================================
            // CREATE ORDER
            // ==========================================

            const newOrder = await orderModel.create({

                user: userId,

                items: items,

                quantity: quantity,

                orderAmount: orderAmount,

                shippingCharges: shippingCharges || 0,

                paymentMethod: "COD",

                paymentStatus: "COMPLETED",

                orderStatus: "PROCESSING",
                shippingAddress

            });


            // ==========================================
            // CLEAR USER CART
            // ==========================================

            await cartModel.deleteMany({
                user: userId,
            });


            // ==========================================
            // SUCCESS RESPONSE
            // ==========================================

            return res.status(201).json({
                status: 1,
                message: "Order placed successfully",
                data: newOrder,
            });
        }


    } catch (error) {

        console.error("Create Order Error:", error);

        return res.status(500).json({
            status: 0,
            message: "Something went wrong while creating order",
            error: error.message,
        });
    }
};


let verifyOrder = async (req,res) =>{

 let {razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body

  const userId = req.user.userId || req.user.id || req.user._id;

  const hmac = crypto.createHmac('sha256', "SmvIbx81agKLRVp8hgqDqayo")
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
  const generate_signature = hmac.digest("hex")

  if(generate_signature==razorpay_signature){
   await orderModel.updateOne({razorpayOrderId:razorpay_order_id},
        {
            $set:{
                paymentStatus:"COMPLETED",
                razorpayPaymentId:razorpay_payment_id,
                orderStatus:"PROCESSING"

            }
        }
    )

    let sucessRes = await cartModel.deleteMany({
                user: userId,
            });

            res.send({
                status:1,
                message:"Order Sucess"

            })
  }

}


// ======================================================
// GET ALL ORDERS
// ======================================================

const getOrders = async (req, res) => {

    try {

        const userId =
            req.user.userId ||
            req.user.id ||
            req.user._id;

        const orders = await orderModel
            .find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({

            status: 1,

            data: orders,

        });

    } catch (error) {

        return res.status(500).json({

            status: 0,

            message: error.message,

        });

    }

};


// ======================================================
// GET SINGLE ORDER
// ======================================================

const getOrderById = async (req, res) => {

    try {

        const userId =
            req.user.userId ||
            req.user.id ||
            req.user._id;

        const { id } = req.params;

        const order = await orderModel.findOne({

            _id: id,

            user: userId,

        });

        if (!order) {

            return res.status(404).json({

                status: 0,

                message: "Order not found",

            });

        }

        return res.status(200).json({

            status: 1,

            data: order,

        });

    } catch (error) {

        return res.status(500).json({

            status: 0,

            message: error.message,

        });

    }

};


// ======================================================
// CANCEL ORDER
// ======================================================

const cancelOrder = async (req, res) => {

    try {

        const userId =
            req.user.userId ||
            req.user.id ||
            req.user._id;

        const { id } = req.params;

        const order = await orderModel.findOne({

            _id: id,

            user: userId,

        });

        if (!order) {

            return res.status(404).json({

                status: 0,

                message: "Order not found",

            });

        }

        if (order.orderStatus === "COMPLETED") {

            return res.status(400).json({

                status: 0,

                message: "Delivered order cannot be cancelled",

            });

        }

        order.orderStatus = "CANCELLED";

        await order.save();

        return res.status(200).json({

            status: 1,

            message: "Order cancelled successfully",

            data: order,

        });

    } catch (error) {

        return res.status(500).json({

            status: 0,

            message: error.message,

        });

    }

};

// ======================================================
// TRACK ORDER
// ======================================================

const trackOrder = async (req, res) => {

    try {

        const userId =
            req.user.userId ||
            req.user.id ||
            req.user._id;

        const { id } = req.params;

        const order = await orderModel.findOne({

            _id: id,

            user: userId,

        });

        if (!order) {

            return res.status(404).json({

                status: 0,

                message: "Order not found",

            });

        }

        return res.status(200).json({

            status: 1,

            orderStatus: order.orderStatus,

            paymentStatus: order.paymentStatus,

            createdAt: order.createdAt,

            updatedAt: order.updatedAt,

        });

    } catch (error) {

        return res.status(500).json({

            status: 0,

            message: error.message,

        });

    }

};


// ======================================================
// DOWNLOAD INVOICE
// ======================================================

const downloadInvoice = async (req, res) => {

    try {

        const userId =
            req.user.userId ||
            req.user.id ||
            req.user._id;

        const { id } = req.params;

        const order = await orderModel.findOne({

            _id: id,

            user: userId,

        });

        if (!order) {

            return res.status(404).json({

                status: 0,

                message: "Order not found",

            });

        }

        return res.status(200).json({

            status: 1,

            data: order,

        });

    } catch (error) {

        return res.status(500).json({

            status: 0,

            message: error.message,

        });

    }

};

module.exports = {
    createOrder,verifyOrder,getOrders,getOrderById,cancelOrder,trackOrder,downloadInvoice
};