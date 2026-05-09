import grokClient from "../utils/grokClient.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { SITE_CONFIG } from "../config/siteConfig.js";
import {
  buildKnowledgeBase,
  retrieveRelevantChunks,
  getProductCatalog,
  getSellerDirectory,
} from "../utils/knowledgeBase.js";

const isCurrencyQuestion = (message = "") => {
  const text = message.toLowerCase();

  return (
    text.includes("currency") ||
    text.includes("what currency") ||
    text.includes("which currency") ||
    text.includes("prices listed in") ||
    text.includes("price currency") ||
    text.includes("rupees") ||
    text.includes("dollar") ||
    text.includes("usd") ||
    text.includes("pkr") ||
    text.includes("inr")
  );
};

const getCurrencyReply = () => {
  return `The prices on our website are listed in ${SITE_CONFIG.currencyLabel} (${SITE_CONFIG.currencyDisplay}).`;
};

const FAQ_CONTEXT = [
  {
    key: "shipping",
    text: "Shipping timelines and charges may vary by seller. Checkout currently works seller-wise, so products from different sellers are handled separately.",
  },
  {
    key: "returns",
    text: "Return and refund rules should be confirmed with the seller or platform policy page. If a dedicated policy page exists later, plug it here.",
  },
  {
    key: "warranty",
    text: "Warranty depends on the product and seller listing details. Customers should review the product page and seller information.",
  },
  {
    key: "checkout",
    text: "Customers add items to cart, proceed seller-wise to checkout, enter shipping details, and place the order.",
  },
];

const PROJECT_KEYWORDS = [
  "product",
  "products",
  "category",
  "categories",
  "brand",
  "brands",
  "price",
  "stock",
  "seller",
  "sellers",
  "store",
  "cart",
  "checkout",
  "shipping",
  "return",
  "returns",
  "refund",
  "warranty",
  "order",
  "orders",
  "track",
  "tracking",
  "delivery",
  "account",
  "login",
  "register",
  "profile",
  "address",
  "addresses",
  "dashboard",
  "faq",
  "privacy",
  "policy",
  "policies",
  "compare",
  "comparison",
  "recommend",
  "recommendation",
  "website",
  "marketplace",
  "buy",
  "purchase",
  "customer",
  "support",
  "available",
  "how many",
  "total",
  "review",
  "reviews",
  "rating",
  "ratings",
  "vendora",
  "name",
];

const GREETING_KEYWORDS = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
];

const isGreetingOnly = (message = "") => {
  const text = message.trim().toLowerCase();
  return GREETING_KEYWORDS.includes(text);
};

const isProjectRelated = (message = "") => {
  const text = message.toLowerCase();

  if (isGreetingOnly(text)) return true;

  // Check if it contains a seller name from the platform
  const sellerNames = ["alibaba", "daraz", "amazon"];
  if (sellerNames.some((seller) => text.includes(seller))) return true;

  return PROJECT_KEYWORDS.some((keyword) => text.includes(keyword));
};

const getOutOfScopeReply = () => {
  return "I’m here to help with this marketplace and website only. Please ask about products, sellers, orders, shipping, returns, checkout, your account, or other website-related questions.";
};

const detectIntent = (message = "") => {
  const text = message.toLowerCase();

  if (
    text.includes("where is my order") ||
    text.includes("my order") ||
    text.includes("order status") ||
    text.includes("track order")
  ) {
    return "order_assistant";
  }

  if (
    text.includes("compare") &&
    (text.includes(" and ") || text.includes(" vs "))
  ) {
    return "product_comparison";
  }

  if (
    text.includes("shipping") ||
    text.includes("return") ||
    text.includes("refund") ||
    text.includes("warranty") ||
    text.includes("checkout")
  ) {
    return "faq";
  }

  if (
    text.includes("best") ||
    text.includes("recommend") ||
    text.includes("suggest") ||
    text.includes("good for") ||
    text.includes("for pets") ||
    text.includes("for kitchen") ||
    text.includes("for bathroom")
  ) {
    return "recommendation";
  }

  return "product_search";
};

const parseBudget = (message = "") => {
  const match = message.match(/(?:under|below|less than)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return Number(match[1]);
};

const extractComparisonNames = (message = "") => {
  const compareAnd = message.match(/compare\s+(.+?)\s+and\s+(.+)/i);
  if (compareAnd) {
    return [compareAnd[1].trim(), compareAnd[2].trim()];
  }

  const compareVs = message.match(/compare\s+(.+?)\s+vs\.?\s+(.+)/i);
  if (compareVs) {
    return [compareVs[1].trim(), compareVs[2].trim()];
  }

  return [];
};

const getRelevantFaq = (message = "") => {
  const text = message.toLowerCase();
  return FAQ_CONTEXT.filter((item) => text.includes(item.key));
};

const findProductsForSearch = async (message = "", limit = 8) => {
  try {
    const text = message.toLowerCase();
    const budget = parseBudget(message);

    // Build search query based on user message
    const query = { isActive: true };
    const orConditions = [
      { name: { $regex: text, $options: "i" } },
      { category: { $regex: text, $options: "i" } },
      { brand: { $regex: text, $options: "i" } },
      { description: { $regex: text, $options: "i" } },
    ];

    // Add specific keyword conditions
    if (text.includes("waterproof")) {
      orConditions.push({ description: /waterproof/i });
    }
    if (text.includes("pet") || text.includes("pets")) {
      orConditions.push({ description: /pet|pets|animal/i });
    }
    if (text.includes("kitchen")) {
      orConditions.push({ category: /kitchen/i });
    }
    if (text.includes("office")) {
      orConditions.push({ category: /office/i });
    }
    if (text.includes("electronic")) {
      orConditions.push({ category: /electronic/i });
    }

    query.$or = orConditions;

    let products = await Product.find(query)
      .populate("sellerId", "name")
      .sort({ ratings: -1, numReviews: -1, createdAt: -1 })
      .limit(limit * 2)
      .lean();

    // Filter by budget if mentioned
    if (budget !== null) {
      products = products.filter((p) => Number(p.price || 0) <= budget);
    }

    return products.slice(0, limit).map((p) => ({
      name: p.name,
      price: p.price,
      category: p.category,
      brand: p.brand,
      seller: p.sellerId?.name || "Marketplace Seller",
      stock: p.stock,
      inStock: p.stock > 0,
      rating: p.ratings || 0,
      reviewCount: p.numReviews || 0,
    }));
  } catch (error) {
    console.error("findProductsForSearch error:", error);
    return [];
  }
};

const findProductsForRecommendation = async (message = "") => {
  const text = message.toLowerCase();
  const query = { isActive: true };

  if (text.includes("pets") || text.includes("pet")) {
    query.$or = [
      { name: /pet/i },
      { description: /pet|pets|scratch|durable/i },
      { category: /pet/i },
    ];
  }

  const products = await Product.find(query)
    .populate("sellerId", "name")
    .sort({ ratings: -1, createdAt: -1 })
    .limit(8)
    .lean();

  return products;
};

const findOrdersForUser = async (userId) => {
  if (!userId) return [];

  return Order.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
};

const sanitizeAiReply = (text = "") => {
  return String(text)
    .replace(/\b[0-9a-fA-F]{24}\b/g, "[hidden]")
    .replace(/^\s*[*-]?\s*ID:\s.*$/gim, "")
    .replace(/^\s*[*-]?\s*Product ID:\s.*$/gim, "")
    .replace(/^\s*[*-]?\s*User ID:\s.*$/gim, "")
    .replace(/^\s*[*-]?\s*Seller ID:\s.*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const sanitizeHistoryContent = (text = "") => {
  return String(text)
    .replace(/\b[0-9a-fA-F]{24}\b/g, "[hidden]")
    .replace(/^\s*[*-]?\s*ID:\s.*$/gim, "")
    .trim();
};

const mapSafeProductForContext = (p) => ({
  name: p.name,
  price: p.price,
  category: p.category,
  brand: p.brand,
  stock: p.stock,
  ratings: p.ratings,
  sellerName: p.sellerId?.name || "Marketplace Seller",
  description: p.description,
});

const mapSafeProductForResponse = (p) => ({
  name: p.name,
  price: p.price,
  category: p.category,
  brand: p.brand,
  stock: p.stock,
  image: p.images?.[0] || "",
  sellerName: p.sellerId?.name || "Marketplace Seller",
});

const mapSafeOrderForContext = (o) => ({
  orderNumber: o.orderNumber,
  sellerOrderRef: o.sellerOrderRef,
  sellerName: o.sellerName,
  overallStatus: o.overallStatus,
  paymentStatus: o.paymentStatus,
  totalPrice: o.totalPrice,
  createdAt: o.createdAt,
  items: (o.items || []).map((i) => ({
    name: i.name,
    quantity: i.quantity,
    fulfillmentStatus: i.fulfillmentStatus,
    trackingNumber: i.trackingNumber,
  })),
});

export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (isGreetingOnly(message)) {
      return res.status(200).json({
        success: true,
        reply: "Welcome to Vendora AI Marketplace! I'm here to help you find products, track orders, answer questions about shipping, returns, and more. What can I help you with today?",
        intent: "greeting",
        products: [],
        orders: [],
      });
    }

    if (!isProjectRelated(message)) {
      return res.status(200).json({
        success: true,
        reply: getOutOfScopeReply(),
        intent: "out_of_scope",
        products: [],
        orders: [],
      });
    }

    if (isCurrencyQuestion(message)) {
      return res.status(200).json({
        success: true,
        reply: getCurrencyReply(),
        intent: "currency_info",
        products: [],
        orders: [],
      });
    }

    // Build knowledge base and retrieve relevant chunks
    const knowledgeTexts = await buildKnowledgeBase();
    const relevantChunks = retrieveRelevantChunks(message.trim(), knowledgeTexts, 12);
    const context = relevantChunks.length
      ? relevantChunks.join("\n\n")
      : "No specific context available, but I can help with general marketplace information.";

    // Get additional product catalog for product-related queries
    const messageLower = message.toLowerCase();
    let additionalContext = "";

    if (
      messageLower.includes("product") ||
      messageLower.includes("what do you have") ||
      messageLower.includes("what's available") ||
      messageLower.includes("show me")
    ) {
      const catalog = await getProductCatalog();
      if (catalog.length > 0) {
        const catalogSummary = `AVAILABLE PRODUCTS: ${catalog
          .slice(0, 15)
          .map((p) => `"${p.name}" (${p.category}, $${p.price}) by ${p.seller}`)
          .join(" | ")}`;
        additionalContext = catalogSummary;
      }
    }

    if (messageLower.includes("seller") && !messageLower.includes("seller policy")) {
      const sellers = await getSellerDirectory();
      if (sellers.length > 0) {
        const sellerSummary = `SELLERS ON PLATFORM: ${sellers.map((s) => `${s.name} (${s.productCount} products)`).join(", ")}`;
        additionalContext = sellerSummary;
      }
    }

    let orderContext = "";
    if (detectIntent(message) === "order_assistant" && req.user?._id) {
      const orders = await findOrdersForUser(req.user._id);
      if (orders.length) {
        orderContext = `Your recent orders:\n${orders
          .slice(0, 3)
          .map(
            (o) =>
              `Order #${o.orderNumber} (${o.overallStatus}) - Total: $${o.totalPrice} - Items: ${o.items.map((i) => i.name).join(", ")}`
          )
          .join("\n")}`;
      }
    }

    // Comprehensive system prompt for strong RAG
    const systemPrompt = `You are Vendora AI Marketplace Assistant. Your role is to:
1. Help users find products by name, category, seller, or price
2. Provide detailed product information including prices, ratings, seller names, and stock status
3. Answer questions about shipping, returns, checkout, and policies
4. Track orders and provide order status
5. Make product recommendations based on user needs
6. List available products, sellers, and categories

CRITICAL INSTRUCTIONS:
- ALWAYS provide specific product names from the knowledge base when asked about products
- Include exact prices, seller names, and categories when mentioning products
- If user asks "what products are available" or "show me all products", list them with full details
- For product comparisons, provide side-by-side details from the database
- Be conversational but data-driven - use the context provided
- If information is not in the context, say "I don't have that specific information, but you can check the website"
- Never make up product names or prices - only use data from context
- When listing products, format as: "Product Name ($Price) from Seller Name - Rating/5 stars"`;

    // Prepare messages with history
    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              m.content
          )
          .slice(-4)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }))
      : [];

    // Build comprehensive context
    let fullContext = context;
    if (additionalContext) {
      fullContext += `\n\n${additionalContext}`;
    }
    if (orderContext) {
      fullContext += `\n\n${orderContext}`;
    }

    const input = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `KNOWLEDGE BASE:\n${fullContext}` },
      ...safeHistory,
      { role: "user", content: message.trim() },
    ];

    // Generate response with Groq
    const response = await grokClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: input,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content || "I could not generate a reply.";
    const intent = detectIntent(message);

    // For product search intents, also return structured product data
    let productsToReturn = [];
    if (
      intent === "product_search" ||
      intent === "recommendation" ||
      messageLower.includes("product")
    ) {
      productsToReturn = await findProductsForSearch(message, 5);
    }

    return res.status(200).json({
      success: true,
      reply: sanitizeAiReply(reply),
      intent,
      products: productsToReturn,
      orders: [],
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return res.status(500).json({ message: "AI request failed" });
  }
};