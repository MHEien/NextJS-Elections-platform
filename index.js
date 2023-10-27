"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var httpServer = http_1.default.createServer();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
io.on("connection", function (socket) {
    var userId = socket.handshake.query.userId;
    console.log("User with ID ".concat(userId, " connected"));
    // Emit an event when a user connects
    io.emit("status-update", { id: userId, onlineStatus: true });
    socket.on("join_election", function (electionId) {
        socket.join(electionId);
        console.log("user with id-".concat(socket.id, " joined election - ").concat(electionId));
    });
    socket.on("vote", function (data) {
        console.log(data, "DATA");
        // Broadcast the vote to all users in the election room
        io.to(data.electionId).emit("receive_msg", data);
    });
    socket.on("disconnect", function () {
        console.log("A user disconnected:", userId);
        // Emit an event when a user disconnects
        io.emit("status-update", { id: userId, onlineStatus: false });
    });
});
var PORT = process.env.PORT || 3001;
httpServer.listen(PORT, function () {
    console.log("Socket.io server is running on port ".concat(PORT));
});
