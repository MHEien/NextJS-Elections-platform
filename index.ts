import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import prisma from "./lib/prisma";

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

  socket.on("join_chat", (data) => {
    // Create a unique room for each voter
    const room = `${data.electionId}-${data.userId}`;
    socket.join(room);
    console.log(`user with id-${socket.id} joined chat - ${room}`);
  
    // Join the election-specific room
    const electionRoom = `${data.electionId}`;
    socket.join(electionRoom);
    console.log(`user joined chat - ${electionRoom}`);
  });
  
  socket.on("send_message", async (newMessage) => {
    console.log(newMessage, "DATA");
  
    try {
      // Create a 'Chat' record and a 'Message' record in a single nested query
      const chat = await prisma.chat.create({
        data: {
          electionId: newMessage.electionId,
          messages: {
            create: {
              content: newMessage.message,
              timestamp: newMessage.timestamp,
              sender: {
                connect: {
                  id: newMessage.userId,
                },
              },
              sentAt: newMessage.timestamp,
            },
          },
        },
      });
  
      console.log(chat, "CHAT");
    } catch (e) {
      console.log(e);
    }
  
    // Emit the message to the election-specific room
    const electionRoom = `${newMessage.electionId}`;
    io.to(electionRoom).emit("message", newMessage);
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