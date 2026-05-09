import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getProductReviewsApi = async (productId) => {
  const { data } = await API.get(`/reviews/${productId}`);
  return data;
};

export const getReviewEligibilityApi = async (productId) => {
  const { data } = await API.get(`/reviews/${productId}/eligibility`);
  return data;
};

export const addOrUpdateProductReviewApi = async (productId, payload) => {
  const { data } = await API.post(`/reviews/${productId}`, payload);
  return data;
};

export const deleteMyProductReviewApi = async (productId) => {
  const { data } = await API.delete(`/reviews/${productId}`);
  return data;
};