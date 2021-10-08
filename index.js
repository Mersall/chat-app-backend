const express = require("express");
const app = express();
const socketIO = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = express()
  .use(app)
  .listen("8080", () => console.log(`Listening Socket on 8080`));

const io = socketIO(server);

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
