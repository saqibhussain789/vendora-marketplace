import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getMyNotificationsApi = async () => {
  const { data } = await API.get("/notifications");
  return data;
};

export const getUnreadNotificationCountApi = async () => {
  const { data } = await API.get("/notifications/unread-count");
  return data;
};

export const markNotificationAsReadApi = async (id) => {
  const { data } = await API.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsAsReadApi = async () => {
  const { data } = await API.patch("/notifications/read-all");
  return data;
};