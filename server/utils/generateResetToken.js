import crypto from "crypto";

export const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expireTime = new Date(Date.now() + 15 * 60 * 1000);

  return {
    rawToken,
    hashedToken,
    expireTime,
  };
};

export const hashResetToken = (token = "") => {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
};