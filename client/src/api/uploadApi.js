import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const uploadProductImagesApi = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await API.post("/uploads/products/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};