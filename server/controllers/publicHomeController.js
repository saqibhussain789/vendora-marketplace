import Product from "../models/Product.js";
import User from "../models/User.js";

export const getHomePageData = async (req, res) => {
  try {
    const [
      featuredProducts,
      featuredCategoriesAgg,
      sellerStatsAgg,
      totalProducts,
      distinctCategories,
    ] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("sellerId", "name")
        .lean(),

      Product.aggregate([
        {
          $match: {
            isActive: true,
            category: { $exists: true, $nin: ["", null] },
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$category",
            totalProducts: { $sum: 1 },
            totalStock: { $sum: "$stock" },
            sampleImage: { $first: { $arrayElemAt: ["$images", 0] } },
          },
        },
        { $sort: { totalProducts: -1, totalStock: -1 } },
        { $limit: 4 },
      ]),

      Product.aggregate([
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
        { $sort: { totalProducts: -1, totalStock: -1 } },
        { $limit: 6 },
      ]),

      Product.countDocuments({ isActive: true }),

      Product.distinct("category", {
        isActive: true,
        category: { $exists: true, $nin: ["", null] },
      }),
    ]);

    const sellerIds = sellerStatsAgg.map((item) => item._id);

    const sellers = await User.find({
      _id: { $in: sellerIds },
      role: "seller",
    })
      .select("name email avatar createdAt")
      .lean();

    const sellerMap = new Map(
      sellers.map((seller) => [String(seller._id), seller])
    );

    const featuredSellers = sellerStatsAgg
      .map((item) => {
        const seller = sellerMap.get(String(item._id));
        if (!seller) return null;

        return {
          _id: seller._id,
          name: seller.name,
          email: seller.email,
          avatar: seller.avatar || "",
          createdAt: seller.createdAt,
          totalProducts: item.totalProducts || 0,
          totalStock: item.totalStock || 0,
          totalCategories: (item.categories || []).filter(Boolean).length,
        };
      })
      .filter(Boolean);

    const featuredCategories = featuredCategoriesAgg.map((item) => ({
      name: item._id,
      totalProducts: item.totalProducts || 0,
      totalStock: item.totalStock || 0,
      sampleImage: item.sampleImage || "",
    }));

    const summary = {
      totalProducts,
      totalCategories: distinctCategories.length,
      totalSellers: sellers.length,
      topCategory: featuredCategories[0]?.name || "",
      topSeller: featuredSellers[0]?.name || "",
    };

    res.status(200).json({
      success: true,
      summary,
      featuredProducts,
      featuredCategories,
      featuredSellers,
    });
  } catch (error) {
    console.error("getHomePageData error:", error);
    res.status(500).json({ message: "Server error" });
  }
};