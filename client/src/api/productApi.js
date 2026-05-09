import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getAllProductsApi = async (params = {}) => {
  const { data } = await API.get("/products", { params });
  return data;
};

export const getSingleProductApi = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const getSellerProductsApi = async () => {
  const { data } = await API.get("/seller/products");
  return data;
};

export const getSingleSellerProductApi = async (id) => {
  const { data } = await API.get(`/seller/products/${id}`);
  return data;
};

export const createProductApi = async (formData) => {
  const { data } = await API.post("/seller/products", formData);
  return data;
};

export const updateSellerProductApi = async (id, formData) => {
  const { data } = await API.put(`/seller/products/${id}`, formData);
  return data;
};

export const deleteSellerProductApi = async (id) => {
  const { data } = await API.delete(`/seller/products/${id}`);
  return data;
};