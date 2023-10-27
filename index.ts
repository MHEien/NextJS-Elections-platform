import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User with ID ${userId} connected`);

  // Emit an event when a user connects
  io.emit("status-update", { id: userId, onlineStatus: true });

  socket.on("join_election", (electionId) => {
    socket.join(electionId);
    console.log(`user with id-${socket.id} joined election - ${electionId}`);
  });

  socket.on("vote", (data) => {
    console.log(data, "DATA");
    // Broadcast the vote to all users in the election room
    io.to(data.electionId).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", userId);
    // Emit an event when a user disconnects
    io.emit("status-update", { id: userId, onlineStatus: false });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});