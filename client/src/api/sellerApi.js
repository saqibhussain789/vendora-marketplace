import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getPublicSellerStoreApi = async (sellerId) => {
  const { data } = await API.get(`/public/sellers/${sellerId}/store`);
  return data;
};

export const getFeaturedSellersApi = async () => {
  const { data } = await API.get("/public/featured-sellers");
  return data;
};