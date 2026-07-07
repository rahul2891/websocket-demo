# WebSocket Demo with Redis

This project is a simple WebSocket server demo built with Node.js, the `ws` library, and Redis. It shows how a real-time application can receive messages from a browser client and broadcast them to other connected clients.

## What this project does

- Starts a simple HTTP server that serves the client page from `index.html`
- Creates a WebSocket server using `ws`
- Accepts messages from a browser client
- Publishes those messages to Redis
- Subscribes to Redis messages and forwards them to all connected WebSocket clients

This is a small example of a real-time messaging architecture.

---

## Why WebSockets are used

WebSockets are used when you need two-way, real-time communication between a client and a server.

### Problems WebSockets solve

Traditional HTTP is request-response based. A client must repeatedly ask the server for updates, which is inefficient for applications like:

- Chat applications
- Live notifications
- Multiplayer games
- Stock tickers
- Live dashboards
- Collaborative editing tools

With WebSockets:

- The connection stays open
- The server can push data to the client instantly
- The client can send data to the server without re-establishing a connection

That makes WebSockets ideal for low-latency real-time apps.

---

## Why WebSockets are useful

Compared with polling or long-polling, WebSockets are better because:

- Lower overhead
- Lower latency
- Fewer unnecessary HTTP requests
- More efficient for bidirectional communication

---

## Why WebSockets can fail in vertical scaling

Vertical scaling means making one machine bigger by adding more CPU, RAM, or storage.

WebSockets can become a problem in vertical scaling because:

- One server can only handle a limited number of open connections
- Memory usage grows as more clients connect
- Each open connection uses CPU and memory
- A single machine can become a bottleneck

If one server instance has to manage thousands or millions of open connections, it may:

- Slow down
- Run out of memory
- Become unstable
- Fail under high traffic

So while vertical scaling helps for a while, it eventually hits a limit.

---

## What horizontal scaling means

Horizontal scaling means adding more server instances instead of making one server bigger.

For WebSocket apps, this is often necessary because each instance can only manage a subset of clients.

The main challenge is that a WebSocket connection is usually tied to one server process. If a client connects to Server A, then messages from Server B may not reach that client unless the system is designed to share events across instances.

---

## How Redis helps with horizontal scaling

Redis is used as a shared message bus between WebSocket server instances.

### How it works

1. A client connects to WebSocket server instance A
2. The server receives a message from that client
3. Server A publishes the message to a Redis channel
4. All other WebSocket server instances subscribe to that Redis channel
5. Those instances forward the message to their local connected clients

This allows multiple WebSocket servers to coordinate and exchange real-time events.

### Why Redis is useful here

- It provides a central communication layer
- It decouples server instances from each other
- It helps broadcast messages to all nodes
- It makes it easier to scale horizontally

---

## How WebSocket scaling works in practice

A scaled WebSocket architecture typically looks like this:

- Multiple WebSocket server instances behind a load balancer
- A shared Redis pub/sub system for message distribution
- Clients connect to any server instance
- Messages are broadcast across all instances using Redis

### Important point

A WebSocket connection is stateful and belongs to a specific server instance. So scaling is not just about adding more servers; you also need a way to share events between them.

That is why Redis pub/sub or another shared messaging layer is commonly used.

---

## Project structure

- `server.js` – Starts the HTTP/WebSocket server and handles message flow
- `index.html` – Simple browser client that connects to the WebSocket server
- `connection.js` – Redis client setup for publishing and subscribing
- `docker-compose.yml` – Starts Redis in a container
- `package.json` – Project dependencies

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running the project

Start the Redis container:

```bash
docker compose up -d
```

Start the WebSocket server:

```bash
node server.js
```

Open the app in your browser:

```text
http://localhost:9000/
```

---

## How the demo works

1. The browser opens a WebSocket connection to the server
2. The server logs the connection
3. The browser sends a message
4. The server publishes that message to Redis
5. The subscriber receives the message from Redis
6. The server broadcasts it to connected clients

---

## Common WebSocket challenges in production

Here are some important concerns when using WebSockets in real applications:

### 1. Connection management

You need to handle:

- reconnects
- timeouts
- disconnects
- stale connections

### 2. Load balancing

A standard round-robin load balancer may not work well with sticky sessions unless the client remains connected to the same backend instance.

### 3. Stateful connections

WebSocket connections are long-lived. This makes them different from stateless HTTP requests.

### 4. Scaling complexity

You need a shared transport for cross-node messaging if you run multiple server instances.

### 5. Security

You should use:

- HTTPS/WSS
- authentication
- rate limiting
- input validation

---

## When to use WebSockets

Use WebSockets when you need:

- real-time updates
- immediate communication
- persistent client-server connections

Avoid them when:

- the data is simple and infrequent
- the app does not require live updates
- a normal HTTP request is sufficient

---

## Summary

WebSockets are the right choice for real-time applications because they allow persistent, low-latency, bidirectional communication. However, they are harder to scale than standard HTTP services because each open connection is stateful. Redis helps solve that by providing a shared publish/subscribe layer so multiple WebSocket servers can work together.

---

## Extra notes

This demo is intentionally simple. In a real production system, you might also use:

- Nginx or HAProxy for load balancing
- Redis Streams or Kafka for larger-scale event distribution
- Socket.IO for easier client/server abstraction
- authentication tokens for secure access
- a database for persistence

---

## Next steps

You can extend this project by:

- adding user names and chat rooms
- storing chat history in a database
- adding authentication
- deploying multiple WebSocket instances behind a load balancer
- replacing Redis pub/sub with a more advanced message broker
