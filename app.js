const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;
let connectedPeers = [];

io.on("connection", (socket) => {
  console.log("user connected to socket.IO server");
  connectedPeers.push(socket.id);

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    connectedPeers = connectedPeers.filter((id) => id !== socket.id);
  });

  socket.on("pre-offer", (data) => {
    const { calltype, code } = data;
    const connectPeer = connectedPeers.find((peer) => peer == code);

    if (connectPeer) {
      const data = {
        callerId: socket.id,
        calltype,
      };

      io.to(code).emit("pre-offer", data);
    } else {
      const data = {
        preOfferAnswer: "CALL_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", data);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    const connectedPeer = connectedPeers.find(
      (socketid) => socketid === data.callerId
    );

    if (connectedPeer) io.to(data.callerId).emit("pre-offer-answer", data);
  });

  socket.on("webRTC-signaling", (data) => {
    const { socketid } = data;
    console.log(" webRTC-signaling -==> ", socketid);
    const connectedPeer = connectedPeers.find((id) => socket.id === id);

    if (connectedPeer) {
      io.to(socketid).emit("webRTC-signaling", data);
    }
  });
});

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(PORT, () => {
  console.log("listening on " + PORT);
});
