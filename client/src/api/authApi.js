import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const registerUserApi = async (formData) => {
  const { data } = await API.post("/auth/register", formData);
  return data;
};

export const loginUserApi = async (formData) => {
  const { data } = await API.post("/auth/login", formData);
  return data;
};

export const logoutUserApi = async () => {
  const { data } = await API.post("/auth/logout");
  return data;
};

export const getMeApi = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

export const forgotPasswordApi = async (email) => {
  const { data } = await API.post("/auth/forgot-password", { email });
  return data;
};

export const resetPasswordApi = async (token, payload) => {
  const { data } = await API.post(`/auth/reset-password/${token}`, payload);
  return data;
};