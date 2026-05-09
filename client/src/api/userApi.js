import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const updateProfileApi = async (formData) => {
  const { data } = await API.put("/users/profile", formData);
  return data;
};

export const addAddressApi = async (formData) => {
  const { data } = await API.post("/users/addresses", formData);
  return data;
};

export const updateAddressApi = async (addressId, formData) => {
  const { data } = await API.put(`/users/addresses/${addressId}`, formData);
  return data;
};

export const deleteAddressApi = async (addressId) => {
  const { data } = await API.delete(`/users/addresses/${addressId}`);
  return data;
};