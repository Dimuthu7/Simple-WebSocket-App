const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for join_room events that are emitted by the client. 
  socket.on("join_room", (data) => {

    // Join a room. Rooms are groups of sockets that can communicate with each other.
    socket.join(data);
  });

  socket.on("send_private_message", (data) => {

    // Emit receive_private_message event to the relevant room.
    socket.to(data.room).emit("receive_private_message", data);
  });

  socket.on("send_broadcast_message", (data) => {

    // Emit receive_broadcast_message event to the all rooms. Broadcast message.
    socket.broadcast.emit("receive_broadcast_message", data);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
