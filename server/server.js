import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sellerProductRoutes from "./routes/sellerProductRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import sellerOrderRoutes from "./routes/sellerOrderRoutes.js";
import publicSellerRoutes from "./routes/publicSellerRoutes.js";
import publicHomeRoutes from "./routes/publicHomeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import { initSocketServer } from "./socket/socketServer.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", roleRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerOrderRoutes);
app.use("/api/public", publicSellerRoutes);
app.use("/api/public", publicHomeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

initSocketServer(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});