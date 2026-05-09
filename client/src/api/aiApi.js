import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const chatWithAiApi = async (payload) => {
  const { data } = await API.post("/ai/chat", payload);
  return data;
};