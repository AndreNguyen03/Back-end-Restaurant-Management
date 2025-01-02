import accountModel from "../models/accountModel.js";
import customerModel from "../models/customerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail, generateOTP } from "../service/mailSender.js";
import Otp from "../models/otpModel.js";
const customerRegister = async (req, res) => {
  const { fullName, email, phoneNumber, username, password, otp } = req.body;

  try {
    // Check if the OTP is valid
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP không đúng, hoặc đã hết hạn",
      });
    }

    // Check if phone number is already in use
    const existingPhoneNumber = await customerModel.findOne({
      phone_number: phoneNumber,
    });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại đã được sử dụng" });
    }

    // Check if username is already in use
    const existingAccount = await accountModel.findOne({ username });
    if (existingAccount) {
      return res
        .status(400)
        .json({ success: false, message: "Tên tài khoản đã được sử dụng" });
    }

    // Create new customer
    const newCustomer = new customerModel({
      full_name: fullName,
      phone_number: phoneNumber,
      email,
    });
    await newCustomer.save();

    // Create new account
    const newAccount = new accountModel({
      username,
      password,
      role: "customer",
      userId: newCustomer._id,
    });
    await newAccount.save();

    // Delete the OTP record after successful registration
    await Otp.deleteOne({ email, otp });

    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
};

const customerLogin = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await accountModel.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    console.log("user found");

    const isPasswordValid = await bcrypt.compare(
      `${req.body.password}`,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    let options = {
      maxAge: 3600 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      sameSite: "None",
    };

    const token = user.generateAccessJWT();
    res.cookie("SessionID", token, options);
    res.status(200).json({
      success: true,
      message: "You have successfully logged in",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
  res.end();
};

const checkAuth = async (req, res) => {
  try {
    if (req.cookies.SessionID) {
      const decoded = jwt.verify(
        req.cookies.SessionID,
        process.env.SECRET_ACCESS_TOKEN
      );
      const user = await accountModel.findById(decoded.id);
      const customer = await customerModel.findById(user.userId);
      if (user) {
        return res.json({
          isAuthenticated: true,
          role: user.role,
          user: {
            id: user._id,
            username: user.username,
            fullName: customer.full_name,
            email: customer.email,
            phoneNumber: customer.phone_number,
            customerId: customer._id
          },
        });
      }
    }

    console.log("No valid token");
    return res.status(401).json({
      isAuthenticated: false,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    return res.status(401).json({
      isAuthenticated: false,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("SessionID");
  res.status(200).json({
    success: true,
    message: "You have successfully logged out",
  });
};

const getOTP = async (req, res) => {
  const email = req.body.email;
  const existingEmail = await customerModel.findOne({ email });
  if (existingEmail) {
    return res.status(401).json({
      success: false,
      message: "Email đã được sử dụng",
    });
  }

  // Check rate limiting and cooldown period
  const otpRequests = await Otp.find({ email })
    .sort({ createdAt: -1 })
    .limit(5);
  // if (otpRequests.length >= 5) {
  //     const firstRequestTime = otpRequests[4].createdAt;
  //     const currentTime = new Date();
  //     if ((currentTime - firstRequestTime) < 3600000) { // 1 hour
  //         return res.status(429).json({
  //             success: false,
  //             message: "Quá nhiều yêu cầu OTP. Vui lòng thử lại sau."
  //         });
  //     }
  // }

  const lastRequestTime = otpRequests[0]?.createdAt;
  const currentTime = new Date();
  if (lastRequestTime && currentTime - lastRequestTime < 60000) {
    // 1 minute cooldown
    return res.status(429).json({
      success: false,
      message: "Vui lòng đợi một phút trước khi yêu cầu OTP mới.",
    });
  }

  const otp = generateOTP();

  const mailOptions = {
    from: "tomato22520060@gmail.com",
    to: email,
    subject: "Mã OTP xác thực tài khoản",
    text: `Xin chào,

Cảm ơn bạn đã đăng ký tài khoản tại website nhà hàng Cà Chua. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản của bạn:

Mã OTP xác thực tài khoản của bạn là: ${otp}

Nếu bạn không yêu cầu mã OTP này, vui lòng bỏ qua email này.

Trân trọng,
Nhà hàng Cà Chua`,
  };

  try {
    await sendMail(mailOptions);
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      const newOtp = new Otp({ email, otp });
      await newOtp.save();
    }
    res.status(200).json({ success: true, message: "Đã gửi OTP qua email" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể gửi OTP",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find customer by email
    const customer = await customerModel.findOne({ email });
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại",
      });
    }

    // Find associated account
    const account = await accountModel.findOne({ userId: customer._id });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    // This will trigger the pre-save middleware
    account.password = password;
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Mật khẩu đã được thay đổi thành công",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thay đổi mật khẩu",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.SessionID;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

    // Find account
    const account = await accountModel.findById(decoded.id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    // Find customer info
    const customer = await customerModel.findById(account.userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin khách hàng",
      });
    }

    // Return profile info
    return res.status(200).json({
      success: true,
      data: {
        fullName: customer.full_name,
        email: customer.email,
        phoneNumber: customer.phone_number,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { fullName, phoneNumber, email } = req.body;

  try {
    const token = req.cookies.SessionID;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    const account = await accountModel.findById(decoded.id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (email) {
      const existingEmail = await customerModel.findOne({
        email,
        _id: { $ne: account.userId },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (phoneNumber) {
      const existingPhone = await customerModel.findOne({
        phone_number: phoneNumber,
        _id: { $ne: account.userId },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
    }

    // Match request body fields with schema fields
    const updateData = {
      ...(fullName && { full_name: fullName }),
      ...(phoneNumber && { phone_number: phoneNumber }),
      ...(email && { email: email }),
    };

    const updatedCustomer = await customerModel.findByIdAndUpdate(
      account.userId,
      updateData,
      { new: true }
    );

    // Return response with frontend-friendly field names
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        fullName: updatedCustomer.full_name,
        phoneNumber: updatedCustomer.phone_number,
        email: updatedCustomer.email,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export {
  customerRegister,
  customerLogin,
  checkAuth,
  logout,
  getOTP,
  changePassword,
  getProfile,
  updateProfile,
};
