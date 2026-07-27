const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER REFERENCE
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // ==========================================
    // ORDER ITEMS
    // FRONTEND SE PURA ARRAY AAYEGA
    // ==========================================

    items: {
      type: Array,
      required: true,
      default: [],
    },

    // ==========================================
    // TOTAL QUANTITY
    // ==========================================

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // ==========================================
    // ORDER AMOUNT
    // ==========================================

    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // SHIPPING CHARGES
    // ==========================================

    shippingCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    shippingAddress: {
    type: Object,
    default: {},
},

    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED"],
      default: "PENDING",
    },

    // ==========================================
    // RAZORPAY ORDER ID
    // ==========================================

    razorpayOrderId: {
      type: String,
      default: null,
    },

    // ==========================================
    // RAZORPAY PAYMENT ID
    // ==========================================

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    // ==========================================
    // ORDER STATUS
    // ==========================================

    orderStatus: {

    type: String,

    enum: [

        "PENDING",

        "PROCESSING",

        "COMPLETED",

        "CANCELLED"

    ],

    default: "PENDING",

},
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model(
  "order",
  orderSchema,
  "order"
);

module.exports = {
  orderModel,
};