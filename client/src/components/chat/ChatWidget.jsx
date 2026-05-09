import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, Star, Eye } from "lucide-react";
import { chatWithAiApi } from "../../api/aiApi";
import { getAllProductsApi, getSingleProductApi } from "../../api/productApi";

const quickPrompts = [
  "Show my recent orders",
  "Best products under 5000",
  "Compare two products",
  "What is your return policy?",
];

const formatPrice = (value) => {
  return `${Number(value || 0).toLocaleString()} $`;
};

const getOrderStatusClasses = (status = "") => {
  const value = status.toLowerCase();

  if (value === "delivered") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (value === "shipped") {
    return "bg-sky-50 text-sky-700 ring-sky-200";
  }

  if (value === "processing") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  if (value === "cancelled" || value === "failed") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const getPaymentStatusClasses = (status = "") => {
  const value = status.toLowerCase();

  if (value === "paid") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (value === "failed") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
};

function OrderCardsMessage({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        I could not find any orders for your account.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Here are your recent orders:</p>
        <p className="mt-1 text-slate-500">
          I have listed them in a clean format so they are easier to review.
        </p>
      </div>

      {orders.map((order, index) => (
        <div
          key={order._id || index}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Order {index + 1}
              </p>
              <h4 className="mt-1 text-sm font-semibold text-slate-900">
                {order.orderNumber || "Order"}
              </h4>
              {order.sellerOrderRef ? (
                <p className="mt-1 text-xs text-slate-500">
                  Ref: {order.sellerOrderRef}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${getOrderStatusClasses(
                  order.overallStatus
                )}`}
              >
                {order.overallStatus || "pending"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${getPaymentStatusClasses(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus || "pending"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Seller</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {order.sellerName || "Marketplace Seller"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Total Price</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Items
            </p>

            <div className="mt-2 space-y-2">
              {(order.items || []).map((item, itemIndex) => (
                <div
                  key={item._id || itemIndex}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity}
                        {item.trackingNumber ? ` • Tracking: ${item.trackingNumber}` : ""}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${getOrderStatusClasses(
                        item.fulfillmentStatus
                      )}`}
                    >
                      {item.fulfillmentStatus || "pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product, onViewDetails }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{product.name}</p>
          <p className="mt-1 text-xs text-slate-500">{product.category} • {product.brand || ""}</p>
          <p className="mt-2 text-sm font-medium text-slate-900">{formatPrice(product.price)}</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} />
              <span className="text-xs font-medium text-slate-700">{(product.rating || 0).toFixed(1)}/5</span>
            </div>
            <p className="text-xs text-slate-500">• {product.seller}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onViewDetails(product.name)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white"
          >
            <Eye size={14} /> Details
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductListMessage({ products = [], onViewDetails }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
        No matching products were found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Products</p>
        <p className="mt-1 text-slate-500">Click a product to view full details.</p>
      </div>

      <div className="grid gap-3">
        {products.map((p, i) => (
          <ProductCard key={p.name + i} product={p} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}

function ProductDetailMessage({ product }) {
  if (!product) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{product.name}</h4>
          <p className="mt-1 text-xs text-slate-500">{product.category} • {product.brand || ""}</p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-slate-500">{product.seller}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-xs text-slate-500">Stock</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{product.stock} units {product.inStock ? "(in stock)" : "(out of stock)"}</p>
        </div>

        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-xs text-slate-500">Rating</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{(product.rating || 0).toFixed(1)}/5 ({product.reviewCount || 0} reviews)</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Description</p>
        <p className="mt-2 text-sm text-slate-700">{product.description || "No description available."}</p>
      </div>

      {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Reviews</p>
          <div className="mt-2 space-y-2">
            {product.reviews.slice(0, 5).map((r, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">{r.userName || 'Customer'}</p>
                <p className="mt-1 text-xs text-slate-700">{r.rating}/5 • {r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TextMessage({ content }) {
  const lines = String(content || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return null;
  }

  const allBulletLike =
    lines.length > 1 &&
    lines.every(
      (line) =>
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        /^\d+\./.test(line)
    );

  if (allBulletLike) {
    return (
      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
        <ul className="space-y-2">
          {lines.map((line, index) => (
            <li key={index} className="leading-6">
              {line.replace(/^(-|\*)\s/, "")}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm whitespace-pre-wrap">
      {content}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      type: "text",
      content:
        "Welcome to Vendora AI Marketplace! I can help you find products, compare items, answer FAQs, or check your order status.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isOpen]);

  const handleSend = async (customText) => {
    const text = (customText || input).trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user", type: "text", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const data = await chatWithAiApi({
        message: text,
        history: nextMessages.slice(0, -1).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // If AI returned structured orders
      if (data.intent === "order_assistant" && Array.isArray(data.orders)) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "orders",
            content: "Here are your recent orders.",
            orders: data.orders,
          },
        ]);
      }

      // If AI returned structured products, render as product list
      else if (Array.isArray(data.products) && data.products.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "products",
            content: data.reply || "Here are the products I found.",
            products: data.products,
          },
        ]);
      }

      // Fallback to plain text reply
      else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: data.reply || "No response received.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: "Something went wrong while contacting AI.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const fetchAndShowProductDetail = async (productName) => {
    if (!productName) return;
    setIsSending(true);

    try {
      // Search by name to get id
      const searchRes = await getAllProductsApi({ search: productName });
      const found = Array.isArray(searchRes.products) ? searchRes.products[0] : null;

      if (!found || !found._id) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "text", content: `I couldn't find a product named \"${productName}\".` },
        ]);
        return;
      }

      const detailRes = await getSingleProductApi(found._id);
      const product = detailRes.product;

      // Map product to frontend-friendly shape
      const mapped = {
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: product.price,
        seller: product.sellerId?.name || "Marketplace Seller",
        stock: product.stock,
        inStock: product.stock > 0,
        rating: product.ratings || 0,
        reviewCount: product.numReviews || 0,
        description: product.description,
        reviews: product.reviews || [],
      };

      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "product_detail", content: `Details for ${mapped.name}`, product: mapped },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "text", content: "Could not load product details right now." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {isOpen ? (
        <div className="fixed inset-x-3 bottom-24 z-50 flex h-[76vh] max-h-[680px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-5 sm:w-[390px] md:w-[430px]">
          <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Vendora AI</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Product search, FAQs, comparisons, and order help
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                Online
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
            {messages.length === 1 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[88%] ${msg.role === "user" ? "" : ""}`}>
                    {msg.role === "user" ? (
                      <div className="rounded-2xl bg-teal-600 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                        {msg.content}
                      </div>
                    ) : msg.type === "orders" ? (
                      <OrderCardsMessage orders={msg.orders} />
                    ) : (
                      <TextMessage content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {isSending ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Ask about products, shipping, or orders..."
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
              />

              <button
                onClick={() => handleSend()}
                disabled={isSending || !input.trim()}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}