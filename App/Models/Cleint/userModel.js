const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // EMAIL
    // ==========================================

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // PASSWORD
    // ==========================================

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    active: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // CREATED DATE
    // ==========================================

    createdOn: {
      type: Date,
      default: Date.now,
    },

    // ==========================================
    // UPDATED DATE
    // ==========================================

    updatedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

// Unique Email Index
userSchema.index({ email: 1 }, { unique: true });

// Active Users
userSchema.index({ active: 1 });

// Latest Users
userSchema.index({ createdAt: -1 });

// Active + Latest Users
userSchema.index({ active: 1, createdAt: -1 });

const userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;