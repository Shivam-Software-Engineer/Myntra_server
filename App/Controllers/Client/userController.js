const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../../Models/Cleint/userModel");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const apiInstance = require("../../Configurations/mailConfig");


// =====================================================
// TEMPORARY OTP STORAGE
// =====================================================
//
// Registration aur Forgot Password dono ke OTP
// yahan temporarily store honge.
//
// Structure:
//
// email => {
//
//   type: "register"
//   OR
//   type: "forgot-password",
//
//   password,          // Only register ke liye
//
//   otp,
//
//   otpExpiresAt
//
// }
//
// IMPORTANT:
//
// Server restart hone par ye data clear ho jayega.
//
// Production mein Redis / MongoDB TTL use karna better hai.
// =====================================================

const otpStore = new Map();


// =====================================================
// TEMPORARY PASSWORD RESET TOKEN STORAGE
// =====================================================
//
// OTP verify hone ke baad reset token yahan save hoga.
//
// Structure:
//
// email => {
//
//   resetToken,
//
//   resetTokenExpiresAt
//
// }
//
// Password successfully reset hone ke baad
// reset token delete kar diya jayega.
//
// =====================================================

const resetTokenStore = new Map();


// =====================================================
// GENERATE 6 DIGIT OTP
// =====================================================

const generateOtp = () => {

  return Math.floor(

    100000 +
    Math.random() * 900000

  ).toString();

};


// =====================================================
// SEND REGISTER OTP EMAIL
// =====================================================

const sendOtpEmail = async (email, otp) => {
  try {

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    };

    sendSmtpEmail.to = [
      {
        email: email,
      },
    ];

    sendSmtpEmail.subject = "Your OTP for Registration";

    sendSmtpEmail.htmlContent = `

      <div style="
        max-width: 500px;
        margin: auto;
        font-family: Arial, sans-serif;
        border: 1px solid #eeeeee;
        padding: 30px;
        border-radius: 10px;
      ">

        <h2 style="
          color: #ff3f6c;
          margin-bottom: 20px;
        ">
          Email Verification
        </h2>

        <p style="
          color: #555555;
          font-size: 15px;
        ">
          Your OTP for email verification is:
        </p>

        <h1 style="
          letter-spacing: 8px;
          color: #333333;
          font-size: 32px;
        ">
          ${otp}
        </h1>

        <p style="
          color: #555555;
        ">
          This OTP is valid for 10 minutes.
        </p>

        <p style="
          color: #777777;
          font-size: 13px;
        ">
          If you did not request this OTP,
          please ignore this email.
        </p>

      </div>

    `;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("OTP Email Sent Successfully:", response);

    return response;

  } catch (error) {

    console.error(
      "Brevo OTP Email Error:",
      error.response?.body || error.message
    );

    throw error;
  }
};
// =====================================================
// SEND FORGOT PASSWORD OTP EMAIL
// =====================================================

const sendForgotPasswordOtpEmail = async (email, otp) => {
  try {

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    };

    sendSmtpEmail.to = [
      {
        email: email,
      },
    ];

    sendSmtpEmail.subject = "Your OTP to Reset Password";

    sendSmtpEmail.htmlContent = `

      <div style="
        max-width: 500px;
        margin: auto;
        font-family: Arial, sans-serif;
        border: 1px solid #eeeeee;
        padding: 30px;
        border-radius: 10px;
      ">

        <h2 style="
          color: #ff3f6c;
          margin-bottom: 20px;
        ">
          Password Reset Request
        </h2>

        <p style="
          color: #555555;
          font-size: 15px;
        ">
          We received a request to reset your password.
        </p>

        <p style="
          color: #555555;
          font-size: 15px;
        ">
          Your OTP for password reset is:
        </p>

        <h1 style="
          letter-spacing: 8px;
          color: #333333;
          font-size: 32px;
        ">
          ${otp}
        </h1>

        <p style="
          color: #555555;
        ">
          This OTP is valid for 10 minutes.
        </p>

        <p style="
          color: #777777;
          font-size: 13px;
        ">
          If you did not request a password reset,
          please ignore this email.
        </p>

      </div>

    `;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      "Forgot Password OTP Email Sent Successfully:",
      response
    );

    return response;

  } catch (error) {

    console.error(
      "Brevo Forgot Password OTP Email Error:",
      error.response?.body || error.message
    );

    throw error;

  }
};



// =====================================================
// SEND OTP
// REGISTER
// POST /web/auth/send-otp
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "password": "12345678"
// }
//
// Flow:
//
// 1. Validate email/password
// 2. Check email already registered
// 3. Generate OTP
// 4. Save OTP in Map
// 5. Send OTP email
//
// =====================================================

const sendOtp = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !email ||
      !password
    ) {

      return res.send({

        status: 0,

        message:
          "Email and password are required",

      });

    }


    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (
      password.length <
      6
    ) {

      return res.send({

        status: 0,

        message:
          "Password must be at least 6 characters",

      });

    }


    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {

      return res.send({

        status: 0,

        message:
          "Please enter a valid email address",

      });

    }


    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser =
      await userModel.findOne({

        email:
          normalizedEmail,

      });


    if (existingUser) {

      return res.send({

        status: 0,

        message:
          "Email is already registered",

      });

    }


    // ==========================================
    // GENERATE OTP
    // ==========================================

    const otp =
      generateOtp();


    // ==========================================
    // OTP EXPIRY
    // 10 MINUTES
    // ==========================================

    const otpExpiresAt =
      Date.now() +
      10 * 60 * 1000;


    // ==========================================
    // STORE REGISTER OTP
    // ==========================================

    otpStore.set(

      normalizedEmail,

      {

        type:
          "register",

        password:
          password,

        otp:
          otp,

        otpExpiresAt:
          otpExpiresAt,

      }

    );


    // ==========================================
    // SEND OTP EMAIL
    // ==========================================

    await sendOtpEmail(

      normalizedEmail,

      otp

    );


    // ==========================================
    // SUCCESS
    // ==========================================

    return res.send({

      status: 1,

      message:
        "OTP sent successfully to your email",

    });


  } catch (error) {

    console.log(

      "Send OTP Error:",

      error

    );


    return res.send({

      status: 0,

      message:
        "Something went wrong while sending OTP",

      error:
        error.message,

    });

  }

};


// =====================================================
// VERIFY OTP
// REGISTER
// POST /web/auth/verify-otp
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "password": "12345678",
//   "otp": "123456"
// }
//
// Flow:
//
// 1. Get OTP from Map
// 2. Check OTP type
// 3. Check password
// 4. Check OTP
// 5. Check expiry
// 6. Check user again
// 7. Hash password
// 8. Create user
// 9. Delete OTP
//
// =====================================================

const verifyOtp = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
      otp,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !email ||
      !password ||
      !otp
    ) {

      return res.send({

        status: 0,

        message:
          "Email, password and OTP are required",

      });

    }


    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    // ==========================================
    // GET OTP DATA
    // ==========================================

    const otpData =
      otpStore.get(

        normalizedEmail

      );


    // ==========================================
    // CHECK OTP SESSION
    // ==========================================

    if (!otpData) {

      return res.send({

        status: 0,

        message:
          "OTP session expired. Please send OTP again",

      });

    }


    // ==========================================
    // CHECK OTP TYPE
    // ==========================================

    if (
      otpData.type !==
      "register"
    ) {

      return res.send({

        status: 0,

        message:
          "Invalid registration OTP session",

      });

    }


    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (
      otpData.password !==
      password
    ) {

      return res.send({

        status: 0,

        message:
          "Registration details are invalid. Please send OTP again",

      });

    }


    // ==========================================
    // CHECK OTP
    // ==========================================

    if (
      otpData.otp !==
      otp
    ) {

      return res.send({

        status: 0,

        message:
          "Invalid OTP",

      });

    }


    // ==========================================
    // CHECK OTP EXPIRY
    // ==========================================

    if (
      otpData.otpExpiresAt <
      Date.now()
    ) {

      otpStore.delete(

        normalizedEmail

      );


      return res.send({

        status: 0,

        message:
          "OTP has expired. Please send OTP again",

      });

    }


    // ==========================================
    // CHECK USER AGAIN
    // ==========================================

    const existingUser =
      await userModel.findOne({

        email:
          normalizedEmail,

      });


    if (existingUser) {

      otpStore.delete(

        normalizedEmail

      );


      return res.send({

        status: 0,

        message:
          "Email is already registered",

      });

    }


    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(

        password,

        10

      );


    // ==========================================
    // CREATE USER
    // ==========================================

    const newUser =
      await userModel.create({

        email:
          normalizedEmail,

        password:
          hashedPassword,

        createdOn:
          new Date(),

        active:
          true,

      });


    // ==========================================
    // DELETE OTP
    // ==========================================

    otpStore.delete(

      normalizedEmail

    );


    // ==========================================
    // SUCCESS
    // ==========================================

    return res.send({

      status: 1,

      message:
        "Registered successfully",

      data: {

        id:
          newUser._id,

        email:
          newUser.email,

        active:
          newUser.active,

        createdOn:
          newUser.createdOn,

      },

    });


  } catch (error) {

    console.log(

      "Verify OTP Error:",

      error

    );


    return res.send({

      status: 0,

      message:
        "Something went wrong while verifying OTP",

      error:
        error.message,

    });

  }

};


// =====================================================
// RESEND OTP
// REGISTER
// POST /web/auth/resend-otp
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "password": "12345678"
// }
//
// =====================================================

const resendOtp = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !email ||
      !password
    ) {

      return res.send({

        status: 0,

        message:
          "Email and password are required",

      });

    }


    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser =
      await userModel.findOne({

        email:
          normalizedEmail,

      });


    if (existingUser) {

      return res.send({

        status: 0,

        message:
          "Email is already registered",

      });

    }


    // ==========================================
    // GENERATE NEW OTP
    // ==========================================

    const newOtp =
      generateOtp();


    // ==========================================
    // NEW OTP EXPIRY
    // ==========================================

    const otpExpiresAt =
      Date.now() +
      10 * 60 * 1000;


    // ==========================================
    // UPDATE OTP STORE
    // ==========================================

    otpStore.set(

      normalizedEmail,

      {

        type:
          "register",

        password:
          password,

        otp:
          newOtp,

        otpExpiresAt:
          otpExpiresAt,

      }

    );


    // ==========================================
    // SEND NEW OTP
    // ==========================================

    await sendOtpEmail(

      normalizedEmail,

      newOtp

    );


    // ==========================================
    // SUCCESS
    // ==========================================

    return res.send({

      status: 1,

      message:
        "New OTP sent successfully",

    });


  } catch (error) {

    console.log(

      "Resend OTP Error:",

      error

    );


    return res.send({

      status: 0,

      message:
        "Something went wrong while resending OTP",

      error:
        error.message,

    });

  }

};


// =====================================================
// LOGIN
// POST /web/auth/login
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "password": "12345678"
// }
//
// Response:
//
// {
//   status: 1,
//   token: "...",
//   data: {...}
// }
//
// =====================================================

const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !email ||
      !password
    ) {

      return res.send({

        status: 0,

        message:
          "Email and password are required",

      });

    }


    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    // ==========================================
    // FIND USER
    // ==========================================

    const user =
      await userModel.findOne({

        email:
          normalizedEmail,

      });

    if (!user) {

      return res.send({

        status: 0,

        message:
          "Invalid email or password",

      });

    }


    // ==========================================
    // CHECK ACTIVE STATUS
    // ==========================================

    if (
      !user.active
    ) {

      return res.send({

        status: 0,

        message:
          "Your account has been deactivated",

      });

    }


    // ==========================================
    // COMPARE PASSWORD
    // ==========================================

    const isPasswordCorrect =
      await bcrypt.compare(

        password,

        user.password

      );


    if (
      !isPasswordCorrect
    ) {

      return res.send({

        status: 0,

        message:
          "Invalid email or password",

      });

    }


    // ==========================================
    // GENERATE JWT TOKEN
    // ==========================================

    const token =
      jwt.sign(

        {

          userId:
            user._id,

          email:
            user.email,

        },

        process.env.JWT_SECRET,

        {

          expiresIn:
            "7d",

        }

      );


    // ==========================================
    // LOGIN SUCCESS
    // ==========================================

    return res.send({

      status: 1,

      message:
        "Login successful",

      token:
        token,

      data: {

        id:
          user._id,

        email:
          user.email,

        active:
          user.active,

        createdOn:
          user.createdOn,

      },

    });


  } catch (error) {

    console.log(

      "Login Error:",

      error

    );


    return res.send({

      status: 0,

      message:
        "Something went wrong during login",

      error:
        error.message,

    });

  }

};


// =====================================================
// FORGOT PASSWORD
// SEND OTP
// POST /web/auth/forgot-password/send-otp
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com"
// }
//
// Flow:
//
// 1. Validate email
// 2. Find user
// 3. Check active
// 4. Generate OTP
// 5. Save OTP
// 6. Send email
//
// =====================================================

const forgotPasswordSendOtp =
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
      } = req.body;


      // ==========================================
      // VALIDATION
      // ==========================================

      if (!email) {

        return res.send({

          status: 0,

          message:
            "Email is required",

        });

      }


      // ==========================================
      // NORMALIZE EMAIL
      // ==========================================

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();


      // ==========================================
      // EMAIL VALIDATION
      // ==========================================

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailRegex.test(
          normalizedEmail
        )
      ) {

        return res.send({

          status: 0,

          message:
            "Please enter a valid email address",

        });

      }


      // ==========================================
      // FIND USER
      // ==========================================

      const existingUser =
        await userModel.findOne({

          email:
            normalizedEmail,

        });


      // ==========================================
      // USER NOT FOUND
      // ==========================================

      if (!existingUser) {

        return res.send({

          status: 0,

          message:
            "No account found with this email address",

        });

      }


      // ==========================================
      // CHECK ACTIVE STATUS
      // ==========================================

      if (
        !existingUser.active
      ) {

        return res.send({

          status: 0,

          message:
            "Your account has been deactivated",

        });

      }


      // ==========================================
      // GENERATE OTP
      // ==========================================

      const otp =
        generateOtp();


      // ==========================================
      // OTP EXPIRY
      // 10 MINUTES
      // ==========================================

      const otpExpiresAt =
        Date.now() +
        10 * 60 * 1000;


      // ==========================================
      // SAVE FORGOT PASSWORD OTP
      // ==========================================

      otpStore.set(

        normalizedEmail,

        {

          type:
            "forgot-password",

          otp:
            otp,

          otpExpiresAt:
            otpExpiresAt,

        }

      );


      // ==========================================
      // SEND OTP EMAIL
      // ==========================================

      await sendForgotPasswordOtpEmail(

        normalizedEmail,

        otp

      );


      // ==========================================
      // SUCCESS
      // ==========================================

      return res.send({

        status: 1,

        message:
          "OTP sent successfully to your registered email",

      });


    } catch (error) {

      console.log(

        "Forgot Password Send OTP Error:",

        error

      );


      return res.send({

        status: 0,

        message:
          "Something went wrong while sending OTP",

        error:
          error.message,

      });

    }

  };


// =====================================================
// FORGOT PASSWORD
// VERIFY OTP
// POST /web/auth/forgot-password/verify-otp
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "otp": "123456"
// }
//
// Success:
//
// resetToken return hoga.
//
// =====================================================

const forgotPasswordVerifyOtp =
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        otp,
      } = req.body;


      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !email ||
        !otp
      ) {

        return res.send({

          status: 0,

          message:
            "Email and OTP are required",

        });

      }


      // ==========================================
      // NORMALIZE EMAIL
      // ==========================================

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();


      // ==========================================
      // GET OTP DATA
      // ==========================================

      const otpData =
        otpStore.get(

          normalizedEmail

        );


      // ==========================================
      // CHECK OTP SESSION
      // ==========================================

      if (!otpData) {

        return res.send({

          status: 0,

          message:
            "OTP session expired. Please request a new OTP",

        });

      }


      // ==========================================
      // CHECK OTP TYPE
      // ==========================================

      if (
        otpData.type !==
        "forgot-password"
      ) {

        return res.send({

          status: 0,

          message:
            "Invalid password reset OTP session",

        });

      }


      // ==========================================
      // CHECK OTP EXPIRY
      // ==========================================

      if (
        otpData.otpExpiresAt <
        Date.now()
      ) {

        otpStore.delete(

          normalizedEmail

        );


        return res.send({

          status: 0,

          message:
            "OTP has expired. Please request a new OTP",

        });

      }


      // ==========================================
      // CHECK OTP
      // ==========================================

      if (
        otpData.otp !==
        otp
      ) {

        return res.send({

          status: 0,

          message:
            "Invalid OTP",

        });

      }


      // ==========================================
      // GENERATE RESET TOKEN
      // ==========================================

      const resetToken =
        jwt.sign(

          {

            email:
              normalizedEmail,

            purpose:
              "password-reset",

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              "10m",

          }

        );


      // ==========================================
      // SAVE RESET TOKEN
      // ==========================================

      resetTokenStore.set(

        normalizedEmail,

        {

          resetToken:
            resetToken,

          resetTokenExpiresAt:
            Date.now() +
            10 * 60 * 1000,

        }

      );


      // ==========================================
      // DELETE OTP
      // OTP CAN'T BE USED AGAIN
      // ==========================================

      otpStore.delete(

        normalizedEmail

      );


      // ==========================================
      // SUCCESS
      // ==========================================

      return res.send({

        status: 1,

        message:
          "OTP verified successfully",

        resetToken:
          resetToken,

      });


    } catch (error) {

      console.log(

        "Forgot Password Verify OTP Error:",

        error

      );


      return res.send({

        status: 0,

        message:
          "Something went wrong while verifying OTP",

        error:
          error.message,

      });

    }

  };


// =====================================================
// FORGOT PASSWORD
// RESET PASSWORD
// POST /web/auth/forgot-password/reset
// =====================================================
//
// Request:
//
// {
//   "email": "user@gmail.com",
//   "resetToken": "...",
//   "newPassword": "newpassword123"
// }
//
// =====================================================

const resetPassword =
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        resetToken,
        newPassword,
      } = req.body;


      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !email ||
        !resetToken ||
        !newPassword
      ) {

        return res.send({

          status: 0,

          message:
            "Email, reset token and new password are required",

        });

      }


      // ==========================================
      // PASSWORD VALIDATION
      // ==========================================

      if (
        newPassword.length <
        6
      ) {

        return res.send({

          status: 0,

          message:
            "Password must be at least 6 characters",

        });

      }


      // ==========================================
      // NORMALIZE EMAIL
      // ==========================================

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();


      // ==========================================
      // VERIFY JWT RESET TOKEN
      // ==========================================

      let decodedToken;


      try {

        decodedToken =
          jwt.verify(

            resetToken,

            process.env.JWT_SECRET

          );

      } catch (tokenError) {

        return res.send({

          status: 0,

          message:
            "Reset session expired. Please request OTP again",

        });

      }


      // ==========================================
      // CHECK TOKEN PURPOSE
      // ==========================================

      if (
        decodedToken.purpose !==
        "password-reset"
      ) {

        return res.send({

          status: 0,

          message:
            "Invalid reset token",

        });

      }


      // ==========================================
      // CHECK TOKEN EMAIL
      // ==========================================

      if (
        decodedToken.email !==
        normalizedEmail
      ) {

        return res.send({

          status: 0,

          message:
            "Invalid password reset request",

        });

      }


      // ==========================================
      // GET RESET TOKEN DATA
      // ==========================================

      const resetData =
        resetTokenStore.get(

          normalizedEmail

        );


      // ==========================================
      // CHECK RESET SESSION
      // ==========================================

      if (!resetData) {

        return res.send({

          status: 0,

          message:
            "Reset session expired. Please verify OTP again",

        });

      }


      // ==========================================
      // CHECK RESET TOKEN MATCH
      // ==========================================

      if (
        resetData.resetToken !==
        resetToken
      ) {

        return res.send({

          status: 0,

          message:
            "Invalid reset token",

        });

      }


      // ==========================================
      // CHECK RESET TOKEN EXPIRY
      // ==========================================

      if (
        resetData.resetTokenExpiresAt <
        Date.now()
      ) {

        resetTokenStore.delete(

          normalizedEmail

        );


        return res.send({

          status: 0,

          message:
            "Reset session expired. Please request OTP again",

        });

      }


      // ==========================================
      // FIND USER
      // ==========================================

      const user =
        await userModel.findOne({

          email:
            normalizedEmail,

        });


      // ==========================================
      // USER NOT FOUND
      // ==========================================

      if (!user) {

        resetTokenStore.delete(

          normalizedEmail

        );


        return res.send({

          status: 0,

          message:
            "User not found",

        });

      }


      // ==========================================
      // CHECK ACTIVE STATUS
      // ==========================================

      if (
        !user.active
      ) {

        resetTokenStore.delete(

          normalizedEmail

        );


        return res.send({

          status: 0,

          message:
            "Your account has been deactivated",

        });

      }


      // ==========================================
      // HASH NEW PASSWORD
      // ==========================================

      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10

        );


      // ==========================================
      // UPDATE PASSWORD
      // ==========================================

      user.password =
        hashedPassword;


      await user.save();


      // ==========================================
      // DELETE RESET TOKEN
      // TOKEN CAN'T BE USED AGAIN
      // ==========================================

      resetTokenStore.delete(

        normalizedEmail

      );


      // ==========================================
      // SUCCESS
      // ==========================================

      return res.send({

        status: 1,

        message:
          "Password reset successfully. Please login with your new password",

      });


    } catch (error) {

      console.log(

        "Reset Password Error:",

        error

      );


      return res.send({

        status: 0,

        message:
          "Something went wrong while resetting password",

        error:
          error.message,

      });

    }

  };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  sendOtp,

  verifyOtp,

  resendOtp,

  login,

  forgotPasswordSendOtp,

  forgotPasswordVerifyOtp,

  resetPassword,

};