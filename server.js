import http from "http";
import fs from "fs/promises";
import path from "path";

import { WebSocketServer} from "ws";

const PORT = process.env.PORT ?? 9000;

const httpServer = http.createServer(async function(req, res){
    const indexFile = await fs.readFile(path.resolve("./index.html"), 'utf-8');
    res.setHeader("Content-Type", "text/html");
    return res.end(indexFile);
})

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.on("connection", (socket) => {
  console.log("WebSocket connection...");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    socket.send(`Server received: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port http://localhost:${PORT}`);
});