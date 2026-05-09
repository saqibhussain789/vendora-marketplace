import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getAllUsersApi = async () => {
  const { data } = await API.get("/admin/users");
  return data;
};

export const getSingleUserApi = async (id) => {
  const { data } = await API.get(`/admin/users/${id}`);
  return data;
};

export const updateUserByAdminApi = async (id, formData) => {
  const { data } = await API.put(`/admin/users/${id}`, formData);
  return data;
};

export const deleteUserByAdminApi = async (id) => {
  const { data } = await API.delete(`/admin/users/${id}`);
  return data;
};