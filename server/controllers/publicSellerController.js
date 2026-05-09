import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getPublicSellerStore = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!isValidObjectId(sellerId)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    })
      .select("name createdAt")
      .lean();

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const products = await Product.find({
      sellerId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("sellerId", "name")
      .lean();

    const categories = [...new Set(products.map((item) => item.category).filter(Boolean))];

    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    );

    res.status(200).json({
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        createdAt: seller.createdAt,
      },
      stats: {
        totalProducts,
        totalStock,
        totalCategories: categories.length,
      },
      categories,
      products,
    });
  } catch (error) {
    console.error("getPublicSellerStore error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFeaturedSellers = async (req, res) => {
  try {
    const grouped = await Product.aggregate([
      {
        $match: {
          isActive: true,
          sellerId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$sellerId",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $sort: {
          totalProducts: -1,
          totalStock: -1,
        },
      },
      {
        $limit: 6,
      },
    ]);

    const sellerIds = grouped.map((item) => item._id);

    const sellers = await User.find({
      _id: { $in: sellerIds },
      role: "seller",
    })
      .select("name createdAt")
      .lean();

    const sellerMap = new Map(
      sellers.map((seller) => [String(seller._id), seller])
    );

    const featuredSellers = grouped
      .map((item) => {
        const seller = sellerMap.get(String(item._id));
        if (!seller) return null;

        return {
          _id: seller._id,
          name: seller.name,
          createdAt: seller.createdAt,
          totalProducts: item.totalProducts || 0,
          totalStock: item.totalStock || 0,
          totalCategories: (item.categories || []).filter(Boolean).length,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      sellers: featuredSellers,
    });
  } catch (error) {
    console.error("getFeaturedSellers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};