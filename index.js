const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
app.use(cors());

app.get("/", function (req, res) {
  res.send("Socket service is run");
});

var connectedUsers = {};
io.on("connection", (socket) => {
  /*Register connected user*/
  socket.on("register", function (username) {
    socket.username = username;
    connectedUsers[username] = socket;
  });

  /*Private chat*/
  socket.on("private_chat", function (data) {
    const to = data.to,
      message = data.message,
      date = data.date;

    if (connectedUsers.hasOwnProperty(to)) {
      connectedUsers[to].emit("private_chat", {
        //The sender's username
        username: socket.username,

        //Message sent to receiver
        message: message,
        date: date,
      });
    }
  });
});

const port = process.env.PORT || "8080";

server.listen(port, () => {
  console.log("listening on*:", port);
});
