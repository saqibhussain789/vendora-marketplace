import Product from "../models/Product.js";
import User from "../models/User.js";

const SITE_NAME = "Vendora";
const STATIC_KNOWLEDGE = [
  `Website: ${SITE_NAME} - An AI marketplace platform where users can buy and sell AI-related and general products.`,
  "User roles: Customer (browse, buy, review), Seller (list products, manage orders), Admin (manage platform).",
  "All prices listed in USD. Free shipping on orders over $500, otherwise $25 flat fee.",
  "Shipping: Seller-wise checkout. Timelines and charges vary by seller.",
  "Returns & Refunds: Depend on seller policies. Check product details.",
  "Checkout: Add items → cart → seller-wise checkout → enter shipping → place order.",
  "Warranty: Provided by seller in product listings.",
  "Reviews: Customers who purchased and received products can review (1-5 stars with comments).",
  "Orders: Real-time notifications, tracking, order status updates.",
  "Seller capabilities: Manage products, orders, store profiles, inventory.",
  "Customer capabilities: Browse products, add to cart, checkout, manage profile, leave reviews, track orders.",
  "Categories: Products are organized by category (Home Office, Fashion, Home Kitchen, Electronics, Accessories, etc.).",
];

// Cache for knowledge base to avoid rebuilding on every request
let cachedKnowledgeBase = null;
let lastKnowledgeBaseBuild = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const normalizeText = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitIntoChunks = (text, chunkSize = 300) => {
  const cleaned = String(text).trim();
  if (!cleaned) return [];
  if (cleaned.length <= chunkSize) return [cleaned];

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = "";

  sentences.forEach((sentence) => {
    if ((current + " " + sentence).trim().length <= chunkSize) {
      current = `${current} ${sentence}`.trim();
      return;
    }
    if (current) chunks.push(current.trim());
    current = sentence.trim();
  });

  if (current) chunks.push(current.trim());
  return chunks;
};

// Enhanced product formatting for RAG
const formatProductForKnowledge = (product) => {
  const sellerName = product.sellerId?.name || "Marketplace Seller";
  const inStock = product.stock > 0 ? "in stock" : "out of stock";
  const avgRating = product.ratings || 0;
  const reviewCount = product.numReviews || 0;
  
  return {
    name: product.name,
    description: product.description || "No description available",
    category: product.category || "General",
    brand: product.brand || "N/A",
    price: product.price || 0,
    seller: sellerName,
    stock: product.stock || 0,
    stockStatus: inStock,
    rating: avgRating,
    reviewCount: reviewCount,
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
  };
};

const buildProductReviewChunks = (product) => {
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const chunks = [];
  const sellerName = product.sellerId?.name || "Marketplace Seller";

  if (reviews.length === 0) {
    chunks.push(
      `"${product.name}" (by ${sellerName}): No customer reviews yet. Product is ${product.stock > 0 ? "in stock" : "out of stock"}.`
    );
    return chunks;
  }

  const averageRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
  const ratingsCount = () => {
    const byRating = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (byRating.hasOwnProperty(r.rating)) byRating[r.rating]++;
    });
    return byRating;
  };
  const ratings = ratingsCount();

  // Overall summary chunk
  chunks.push(
    `"${product.name}" by ${sellerName}: ${reviews.length} customer reviews. Average rating: ${averageRating.toFixed(1)}/5 stars. Rating breakdown - 5-star: ${ratings[5]}, 4-star: ${ratings[4]}, 3-star: ${ratings[3]}, 2-star: ${ratings[2]}, 1-star: ${ratings[1]}.`
  );

  // Sample reviews with detailed context
  const topReviews = reviews.slice(0, 5).map((review) => {
    return `Review for "${product.name}": ${review.userName} gave ${review.rating}/5 stars and said: "${review.comment}"`;
  });
  chunks.push(...topReviews);

  // Highlight best and worst reviews
  const badReviews = reviews.filter((r) => r.rating <= 2);
  const goodReviews = reviews.filter((r) => r.rating >= 4);

  if (badReviews.length > 0) {
    const worst = badReviews.sort((a, b) => a.rating - b.rating)[0];
    chunks.push(
      `Lowest rated review for "${product.name}": ${worst.userName} gave ${worst.rating}/5 stars: "${worst.comment}"`
    );
  }

  if (goodReviews.length > 0) {
    const best = goodReviews.sort((a, b) => b.rating - a.rating)[0];
    chunks.push(
      `Highest rated review for "${product.name}": ${best.userName} gave ${best.rating}/5 stars: "${best.comment}"`
    );
  }

  return chunks;
};

export const buildKnowledgeBase = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedKnowledgeBase && (now - lastKnowledgeBaseBuild) < CACHE_DURATION) {
      return cachedKnowledgeBase;
    }

    const products = await Product.find({ isActive: true })
      .populate("sellerId", "name")
      .select("name description category price brand sellerId reviews ratings numReviews stock")
      .lean();
    
    const sellers = await User.find({ role: "seller" }).select("name").lean();

    const knowledgeChunks = [];

    // 1. Add static knowledge
    knowledgeChunks.push(...STATIC_KNOWLEDGE);

    // 2. Seller directory with products count
    if (sellers.length > 0) {
      const sellerProducts = new Map();
      products.forEach((p) => {
        const sellerId = p.sellerId?._id || p.sellerId;
        if (!sellerProducts.has(String(sellerId))) {
          sellerProducts.set(String(sellerId), []);
        }
        sellerProducts.get(String(sellerId)).push(p.name);
      });

      const sellerListChunk = sellers
        .map((seller) => {
          const productList = sellerProducts.get(String(seller._id)) || [];
          return `Seller: "${seller.name}" has ${productList.length} products: ${productList.join(", ")}`;
        })
        .join(" | ");
      knowledgeChunks.push(sellerListChunk);
    }

    // 3. Complete product inventory with all details
    const productInventoryChunk = products.length > 0
      ? `PRODUCT INVENTORY (${products.length} products): ` +
        products
          .map((p) => {
            const seller = p.sellerId?.name || "Marketplace Seller";
            return `"${p.name}" (${p.category}, $${p.price}) by ${seller}`;
          })
          .join(" | ")
      : "No products available on Vendora.";
    knowledgeChunks.push(productInventoryChunk);

    // 4. Category inventory
    const categoryMap = new Map();
    products.forEach((p) => {
      const cat = p.category || "General";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat).push(p);
    });

    const categoryChunks = Array.from(categoryMap.entries()).map(([category, categoryProducts]) => {
      const productDetails = categoryProducts
        .map((p) => `"${p.name}" ($${p.price}) by ${p.sellerId?.name || "Marketplace Seller"} - ${p.stock} in stock`)
        .join(" | ");
      return `Category "${category}" (${categoryProducts.length} products): ${productDetails}`;
    });
    knowledgeChunks.push(...categoryChunks);

    // 5. Price range and statistics
    if (products.length > 0) {
      const prices = products.map((p) => p.price).sort((a, b) => a - b);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);

      knowledgeChunks.push(
        `Price range on ${SITE_NAME}: $${minPrice.toFixed(2)} (lowest) to $${maxPrice.toFixed(2)} (highest). Average price: $${avgPrice}`
      );

      // Stock status
      const inStockCount = products.filter((p) => p.stock > 0).length;
      const outOfStockCount = products.filter((p) => p.stock <= 0).length;
      knowledgeChunks.push(
        `Stock status: ${inStockCount} products in stock, ${outOfStockCount} out of stock`
      );

      // Top rated products
      const topRated = products
        .filter((p) => p.ratings && p.ratings > 0)
        .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
        .slice(0, 5);
      
      if (topRated.length > 0) {
        const topRatedChunk = `Top rated products: ${topRated
          .map((p) => `"${p.name}" (${(p.ratings || 0).toFixed(1)}/5 with ${p.numReviews || 0} reviews) by ${p.sellerId?.name || "Marketplace Seller"}`)
          .join(" | ")}`;
        knowledgeChunks.push(topRatedChunk);
      }
    }

    // 6. Detailed product information chunks
    const productDetailChunks = products.flatMap((product) => {
      const sellerName = product.sellerId?.name || "Marketplace Seller";
      const inStock = product.stock > 0 ? "in stock" : "out of stock";
      const chunks = [];

      // Full product info in one detailed chunk
      chunks.push(
        `PRODUCT: "${product.name}" | Category: ${product.category} | Brand: ${product.brand || "N/A"} | Price: $${product.price} | Seller: ${sellerName} | Stock: ${product.stock} units (${inStock}) | Rating: ${product.ratings || 0}/5 (${product.numReviews || 0} reviews) | Description: ${product.description}`
      );

      // Additional description chunks if long
      if (product.description && product.description.length > 300) {
        chunks.push(...splitIntoChunks(`Details about "${product.name}": ${product.description}`, 300));
      }

      // Review chunks
      chunks.push(...buildProductReviewChunks(product));

      return chunks;
    });
    knowledgeChunks.push(...productDetailChunks);

    // 7. Brand inventory
    const brandMap = new Map();
    products.forEach((p) => {
      const brand = p.brand || "N/A";
      if (!brandMap.has(brand)) {
        brandMap.set(brand, []);
      }
      brandMap.get(brand).push(p.name);
    });

    const brandChunks = Array.from(brandMap.entries())
      .filter(([brand]) => brand !== "N/A")
      .map(
        ([brand, productNames]) =>
          `Brand "${brand}" has ${productNames.length} products: ${productNames.join(", ")}`
      );
    knowledgeChunks.push(...brandChunks);

    // Cache the knowledge base
    cachedKnowledgeBase = knowledgeChunks;
    lastKnowledgeBaseBuild = now;

    return knowledgeChunks;
  } catch (error) {
    console.error("Error building knowledge base:", error);
    return STATIC_KNOWLEDGE;
  }
};

export const retrieveRelevantChunks = (query, knowledgeTexts, topK = 10) => {
  const normalizedQuery = normalizeText(query);
  const queryTokens = Array.from(
    new Set(normalizedQuery.split(" ").filter((token) => token.length > 2))
  );

  const scoredChunks = knowledgeTexts.map((chunk) => {
    const normalizedChunk = normalizeText(chunk);
    let score = 0;

    // 1. Exact phrase match (highest priority)
    if (normalizedQuery.length > 3 && normalizedChunk.includes(normalizedQuery)) {
      score += 25;
    }

    // 2. Token matching with frequency analysis
    queryTokens.forEach((token) => {
      const occurrences = (normalizedChunk.match(new RegExp(`\\b${token}\\b`, "g")) || [])
        .length;
      score += Math.min(occurrences * 3, 12);
    });

    // 3. Intelligent keyword boosting
    const queryLower = query.toLowerCase();

    // Product listing queries
    if (
      queryLower.includes("what product") ||
      queryLower.includes("list product") ||
      queryLower.includes("show product") ||
      queryLower.includes("available product")
    ) {
      if (normalizedChunk.includes("product inventory")) score += 20;
      if (normalizedChunk.includes("category")) score += 12;
    }

    // Product name queries
    if (queryLower.includes("product name") || queryLower.includes("products are")) {
      if (normalizedChunk.includes("inventory")) score += 18;
      if (normalizedChunk.includes("product:")) score += 15;
    }

    // Seller queries
    if (queryLower.includes("seller") || queryLower.includes("store")) {
      if (normalizedChunk.includes("seller:")) score += 18;
      if (normalizedChunk.includes("seller has")) score += 16;
    }

    // Category queries
    if (queryLower.includes("category") || queryLower.includes("categories")) {
      if (normalizedChunk.includes("category")) score += 18;
    }

    // Price queries
    if (
      queryLower.includes("price") ||
      queryLower.includes("cost") ||
      queryLower.includes("expensive") ||
      queryLower.includes("cheap")
    ) {
      if (normalizedChunk.includes("price")) score += 15;
      if (normalizedChunk.includes("$")) score += 10;
    }

    // Stock/availability queries
    if (
      queryLower.includes("stock") ||
      queryLower.includes("available") ||
      queryLower.includes("in stock")
    ) {
      if (normalizedChunk.includes("stock")) score += 15;
      if (normalizedChunk.includes("in stock")) score += 12;
    }

    // Review/rating queries
    if (
      queryLower.includes("review") ||
      queryLower.includes("rating") ||
      queryLower.includes("rated")
    ) {
      if (normalizedChunk.includes("review")) score += 15;
      if (normalizedChunk.includes("rating")) score += 14;
      if (normalizedChunk.includes("top rated")) score += 16;
    }

    // How many / total queries
    if (
      queryLower.includes("how many") ||
      queryLower.includes("total") ||
      queryLower.includes("count")
    ) {
      if (normalizedChunk.includes("product")) score += 12;
      if (normalizedChunk.includes("statistics")) score += 14;
    }

    // Comparison queries
    if (queryLower.includes("compare") || queryLower.includes("vs")) {
      if (normalizedChunk.includes("product:")) score += 15;
    }

    // FAQ/Policy queries
    if (
      queryLower.includes("shipping") ||
      queryLower.includes("return") ||
      queryLower.includes("refund") ||
      queryLower.includes("warranty")
    ) {
      if (normalizedChunk.includes("shipping")) score += 15;
      if (normalizedChunk.includes("return")) score += 14;
      if (normalizedChunk.includes("warranty")) score += 13;
    }

    // Recommendation queries
    if (
      queryLower.includes("best") ||
      queryLower.includes("recommend") ||
      queryLower.includes("suggest")
    ) {
      if (normalizedChunk.includes("top rated")) score += 18;
      if (normalizedChunk.includes("rating")) score += 12;
    }

    // Specific product name search
    const productNameMatch = query.match(/"([^"]+)"/);
    if (productNameMatch) {
      const productName = productNameMatch[1].toLowerCase();
      if (normalizedChunk.includes(productName)) {
        score += 25;
      }
    }

    return { chunk, score };
  });

  // Sort by score descending and return top K
  const sortedChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0) // Only include scored items
    .slice(0, topK)
    .map((item) => item.chunk);

  return sortedChunks;
};

// Get detailed product catalog for direct search
export const getProductCatalog = async () => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("sellerId", "name")
      .select("name description category price brand sellerId reviews ratings numReviews stock")
      .lean();

    return products.map((p) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      brand: p.brand,
      seller: p.sellerId?.name || "Marketplace Seller",
      stock: p.stock,
      inStock: p.stock > 0,
      rating: p.ratings || 0,
      reviewCount: p.numReviews || 0,
      description: p.description,
    }));
  } catch (error) {
    console.error("Error getting product catalog:", error);
    return [];
  }
};

// Get sellers list with product counts
export const getSellerDirectory = async () => {
  try {
    const sellers = await User.find({ role: "seller" }).select("name").lean();
    const products = await Product.find({ isActive: true })
      .select("sellerId")
      .lean();

    const sellerProducts = new Map();
    products.forEach((p) => {
      const sellerId = String(p.sellerId);
      sellerProducts.set(sellerId, (sellerProducts.get(sellerId) || 0) + 1);
    });

    return sellers.map((seller) => ({
      name: seller.name,
      productCount: sellerProducts.get(String(seller._id)) || 0,
    }));
  } catch (error) {
    console.error("Error getting seller directory:", error);
    return [];
  }
};
