let io = null;

export const initSocketServer = (socketIoInstance) => {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join:user", (userId) => {
      if (!userId) return;

      const roomName = `user:${userId}`;
      socket.join(roomName);

      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
};

export const emitToUser = (userId, eventName, payload) => {
  if (!io || !userId) return;

  io.to(`user:${userId}`).emit(eventName, payload);
};