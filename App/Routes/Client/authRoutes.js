let express = require('express');
const { sendOtp, verifyOtp, resendOtp, register, login, resetPassword, forgotPasswordVerifyOtp, forgotPasswordSendOtp } = require('../../Controllers/Client/userController');

let clientAuthRoutes = express.Router()

// http://localhost:8080/admin/auth/login
clientAuthRoutes.post(
  "/send-otp",
  sendOtp
);


// =====================================================
// VERIFY OTP
// POST /web/auth/verify-otp
// =====================================================

clientAuthRoutes.post(
  "/verify-otp",
  verifyOtp
);


// =====================================================
// RESEND OTP
// POST /web/auth/resend-otp
// =====================================================

clientAuthRoutes.post(
  "/resend-otp",
  resendOtp
);




// =====================================================
// LOGIN
// POST /web/auth/login
// =====================================================

clientAuthRoutes.post(
  "/login",
  login
);

clientAuthRoutes.post(

  "/forgot-password/send-otp",

  forgotPasswordSendOtp

);


// =====================================================
// FORGOT PASSWORD
// VERIFY OTP
// POST /web/auth/forgot-password/verify-otp
// =====================================================

clientAuthRoutes.post(

  "/forgot-password/verify-otp",

  forgotPasswordVerifyOtp

);


// =====================================================
// FORGOT PASSWORD
// RESET PASSWORD
// POST /web/auth/forgot-password/reset
// =====================================================

clientAuthRoutes.post(

  "/forgot-password/reset",

  resetPassword

);


module.exports = {clientAuthRoutes}