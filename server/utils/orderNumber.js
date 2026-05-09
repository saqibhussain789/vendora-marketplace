import Counter from "../models/Counter.js";

const padSequence = (value, length = 6) => {
  return String(value).padStart(length, "0");
};

const getDatePart = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
};

export const getSellerInitials = (sellerName = "") => {
  const initials = sellerName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "SL";
};

export const generateOrderIdentifiers = async (sellerName = "Seller") => {
  const counter = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const datePart = getDatePart();
  const seqPart = padSequence(counter.seq, 6);
  const initials = getSellerInitials(sellerName);

  return {
    orderNumber: `ORD-${datePart}-${seqPart}`,
    sellerOrderRef: `${initials}-${datePart}-${seqPart}`,
  };
};