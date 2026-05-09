import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const placeOrderApi = async (payload) => {
  const { data } = await API.post("/orders", payload);
  return data;
};

export const getMyOrdersApi = async () => {
  const { data } = await API.get("/orders/my-orders");
  return data;
};

export const getSingleOrderApi = async (id) => {
  const { data } = await API.get(`/orders/${id}`);
  return data;
};

export const getAllOrdersAdminApi = async () => {
  const { data } = await API.get("/orders/admin");
  return data;
};

export const updateOrderStatusAdminApi = async (id, payload) => {
  const { data } = await API.put(`/orders/admin/${id}/status`, payload);
  return data;
};

export const getSellerOrdersApi = async () => {
  const { data } = await API.get("/seller/orders");
  return data;
};

export const getSingleSellerOrderApi = async (id) => {
  const { data } = await API.get(`/seller/orders/${id}`);
  return data;
};

export const updateSellerOrderItemStatusApi = async (orderId, itemId, payload) => {
  const { data } = await API.put(
    `/seller/orders/${orderId}/items/${itemId}/status`,
    payload
  );
  return data;
};