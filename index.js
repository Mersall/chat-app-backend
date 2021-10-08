const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
app.use(cors());

app.get("/", function (req, res) {
  res.send("socket world");
});

io.on("connection", async (socket) => {
  socket.on("user_joined", (userInfo, room) => {
    socket.broadcast.to(room).emit("user_joined", userInfo);
  });
  socket.on("join_room", (roomId, cb) => {
    socket.join(roomId);
    cb(`joined ${roomId} Room`);
  });
  socket.on("send_message", (msg, room) => {
    socket.broadcast.to(room).emit("received_message", msg, room);
  });
});

const port = process.env.PORT || "8080";

server.listen(port, () => {
  console.log("listening on*:", port);
});
