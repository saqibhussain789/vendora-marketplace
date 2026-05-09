import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getHomePageDataApi = async () => {
  const { data } = await API.get("/public/home");
  return data;
};