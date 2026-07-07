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
    console.log(`Websocket message received: ${message.toString()}`);


    wsServer.clients.forEach((client) => {
      if (client !== socket && client.readyState === 1) {
        client.send(message.toString());
      }
    });
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port http://localhost:${PORT}`);
});