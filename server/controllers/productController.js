import mongoose from "mongoose";
import Product from "../models/Product.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const category = req.query.category?.trim() || "";
    const minPrice = req.query.minPrice?.toString().trim() || "";
    const maxPrice = req.query.maxPrice?.toString().trim() || "";
    const sort = req.query.sort?.trim() || "newest";
    const inStock = req.query.inStock?.toString().trim() || "";

    const query = {
      isActive: true,
    };

    if (search) {
      const safeSearch = escapeRegex(search);

      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { category: { $regex: safeSearch, $options: "i" } },
        { brand: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category) {
      const safeCategory = escapeRegex(category);
      query.category = { $regex: `^${safeCategory}$`, $options: "i" };
    }

    if (minPrice !== "" || maxPrice !== "") {
      query.price = {};

      if (minPrice !== "" && !Number.isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== "" && !Number.isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }

      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") {
      sortOption = { price: 1, createdAt: -1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1, createdAt: -1 };
    } else if (sort === "rating_desc") {
      sortOption = { ratings: -1, numReviews: -1, createdAt: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("sellerId", "name")
      .sort(sortOption)
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("getAllProducts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("sellerId", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("getSingleProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};