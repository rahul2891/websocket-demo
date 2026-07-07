import http from "http";
import fs from "fs/promises";
import path from "path";

import { WebSocketServer } from "ws";
import { redisPublisher, redisSubscriber } from "./connection.js";

const PORT = process.env.PORT ?? 9000;

const httpServer = http.createServer(async function(req, res){
    const indexFile = await fs.readFile(path.resolve("./index.html"), 'utf-8');
    res.setHeader("Content-Type", "text/html");
    return res.end(indexFile);
})

const REDIS_CHANNEL = "chat";

const wsServer = new WebSocketServer({ server: httpServer });

redisSubscriber.subscribe(REDIS_CHANNEL);

redisSubscriber.on("message", (channel, message) => {
  if(channel === REDIS_CHANNEL) {
    wsServer.clients.forEach((client) => {
      client.send(message.toString());
    })
  }
});

wsServer.on("connection", (socket) => {
  console.log("WebSocket connection...");

  socket.on("message", (message) => {
    console.log(`Websocket message received: ${message.toString()}`);


    // wsServer.clients.forEach((client) => {
    //   if (client !== socket && client.readyState === 1) {
    //     client.send(message.toString());
    //   }
    // });
    // Relay the message to Redis
    console.log("Publishing message to Redis...");
    redisPublisher.publish(REDIS_CHANNEL, message.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port http://localhost:${PORT}`);
});