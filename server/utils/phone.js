export const normalizePhone = (value = "") => {
  return String(value).replace(/\D/g, "");
};

export const isValidPhone = (value = "") => {
  const raw = String(value).trim();

  if (!/^[+]?[\d\s\-()]{7,20}$/.test(raw)) {
    return false;
  }

  const digits = normalizePhone(raw);
  return digits.length >= 7 && digits.length <= 15;
};