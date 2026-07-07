import Redis from 'ioredis';

const redisPublisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
//   password: process.env.REDIS_PASSWORD || undefined,
});

const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
//   password: process.env.REDIS_PASSWORD || undefined,
});

export { redisPublisher, redisSubscriber };