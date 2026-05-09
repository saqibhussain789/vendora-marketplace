import mongoose from "mongoose";
import User from "../models/User.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const allowedRoles = ["admin", "seller", "customer"];

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  addresses: user.addresses,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(serializeUser),
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("getSingleUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, phone, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf = req.user._id.toString() === user._id.toString();

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }

      user.email = email.trim();
    }

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      if (isSelf && role !== "admin") {
        return res.status(400).json({
          message: "You cannot change your own admin role",
        });
      }

      user.role = role;
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("updateUserByAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user._id.toString() === userToDelete._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    await userToDelete.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("deleteUserByAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};