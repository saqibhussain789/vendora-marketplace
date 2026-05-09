import Notification from "../models/Notification.js";
import { emitToUser } from "../socket/socketServer.js";

export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
  link = "",
  meta = {},
}) => {
  if (!userId || !title || !message) {
    throw new Error("userId, title, and message are required for notification");
  }

  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    link,
    meta,
  });

  emitToUser(userId, "notification:new", notification);

  return notification;
};