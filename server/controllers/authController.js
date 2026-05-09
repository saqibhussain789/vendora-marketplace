import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getPasswordValidationErrors, isPasswordAlreadyUsed } from "../utils/passwordRules.js";
import { generateResetToken, hashResetToken } from "../utils/generateResetToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getResetPasswordEmailTemplate } from "../utils/emailTemplates.js";

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar || "",
  addresses: user.addresses,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const isStrongPassword = (password = "") => {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    user: serializeUser(user),
  });
};


export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const passwordErrors = getPasswordValidationErrors(password);

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: passwordErrors[0],
        passwordErrors,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "This email is already in use. Please use a different email.",
      });
    }

    const passwordAlreadyUsed = await isPasswordAlreadyUsed(password);

    if (passwordAlreadyUsed) {
      return res.status(400).json({
        message:
          "This password is already used by another account. Please choose a different password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const safeRole = role === "seller" ? "seller" : "customer";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: serializeUser(req.user),
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const { rawToken, hashedToken, expireTime } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expireTime;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    const emailContent = getResetPasswordEmailTemplate({
      name: user.name,
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Failed to process forgot password request" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.params.token || "").trim();
    const password = String(req.body.password || "");
    const confirmPassword = String(req.body.confirmPassword || "");

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include 1 uppercase letter and 1 special character.",
      });
    }

    const hashedToken = hashResetToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const existingPasswordMatch = await bcrypt.compare(password, user.password);
    if (existingPasswordMatch) {
      return res.status(400).json({
        message: "New password cannot be the same as your current password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};