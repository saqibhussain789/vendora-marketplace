import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@example.com";
    const plainPassword = "Admin12345";

    const existingAdmin = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    if (existingAdmin) {
      existingAdmin.name = "Super Admin";
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.phone = "03000000000";

      await existingAdmin.save();

      console.log("Admin updated successfully");
    } else {
      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        phone: "03000000000",
      });

      console.log("Admin created successfully");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();