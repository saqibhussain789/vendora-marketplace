import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getPasswordValidationErrors = (password = "") => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must include at least one special character.");
  }

  return errors;
};

export const isPasswordAlreadyUsed = async (plainPassword, excludeUserId = null) => {
  const query = excludeUserId ? { _id: { $ne: excludeUserId } } : {};

  const users = await User.find(query).select("+password");

  for (const user of users) {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) {
      return true;
    }
  }

  return false;
};