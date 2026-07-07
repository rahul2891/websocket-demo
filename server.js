import https from "https";
import { WebSocketServer} from "ws";

const PORT = process.env.PORT || 9000;

const httpsServer = https.createServer(async function(req, res){})
const wsServer = new WebSocketServer({ server: httpsServer });

wsServer.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    socket.send(`Server received: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});