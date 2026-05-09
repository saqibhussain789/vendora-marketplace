import mongoose from "mongoose";
import Product from "../models/Product.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const sanitizeProduct = (product) => ({
  _id: product._id,
  name: product.name,
  description: product.description,
  price: product.price,
  category: product.category,
  brand: product.brand,
  images: product.images,
  stock: product.stock,
  isActive: product.isActive,
  sellerId: product.sellerId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products: products.map(sanitizeProduct),
    });
  } catch (error) {
    console.error("getSellerProducts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleSellerProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product: sanitizeProduct(product),
    });
  } catch (error) {
    console.error("getSingleSellerProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
    } = req.body;

    name = name?.trim();
    description = description?.trim();
    category = category?.trim();
    brand = brand?.trim() || "";

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        message: "Please fill all required product fields",
      });
    }

    price = Number(price);
    stock = Number(stock);

    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: "Invalid product price" });
    }

    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Invalid product stock" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      images: Array.isArray(images)
        ? images.map((img) => String(img).trim()).filter(Boolean)
        : [],
      stock,
      sellerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: sanitizeProduct(product),
    });
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSellerProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
      isActive,
    } = req.body;

    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (!cleanName) {
        return res.status(400).json({ message: "Product name cannot be empty" });
      }
      product.name = cleanName;
    }

    if (description !== undefined) {
      const cleanDescription = String(description).trim();
      if (!cleanDescription) {
        return res.status(400).json({ message: "Description cannot be empty" });
      }
      product.description = cleanDescription;
    }

    if (category !== undefined) {
      const cleanCategory = String(category).trim();
      if (!cleanCategory) {
        return res.status(400).json({ message: "Category cannot be empty" });
      }
      product.category = cleanCategory;
    }

    if (brand !== undefined) {
      product.brand = String(brand).trim();
    }

    if (price !== undefined) {
      const cleanPrice = Number(price);
      if (Number.isNaN(cleanPrice) || cleanPrice < 0) {
        return res.status(400).json({ message: "Invalid product price" });
      }
      product.price = cleanPrice;
    }

    if (stock !== undefined) {
      const cleanStock = Number(stock);
      if (Number.isNaN(cleanStock) || cleanStock < 0) {
        return res.status(400).json({ message: "Invalid product stock" });
      }
      product.stock = cleanStock;
    }

    if (images !== undefined) {
      product.images = Array.isArray(images)
        ? images.map((img) => String(img).trim()).filter(Boolean)
        : [];
    }

    if (isActive !== undefined) {
      product.isActive = Boolean(isActive);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: sanitizeProduct(product),
    });
  } catch (error) {
    console.error("updateSellerProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSellerProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("deleteSellerProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};