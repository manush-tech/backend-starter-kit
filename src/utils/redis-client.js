import Redis from "ioredis";

import env from "../lib/env";
import logger from "../loaders/logger";

const redisClient = new Redis({
  host: env().REDIS_HOST,
  port: env().REDIS_PORT,
  family: env().REDIS_FAMILY,
  db: env().REDIS_DB,
  password: env().REDIS_PASS,
});

redisClient.on("error", function (err) {
  logger.error(err);
});

redisClient.on("connect", function () {
  logger.info("Connected to the Redis Server");
});

redisClient.on("ready", async function () {
  logger.info("Redis Instance is Ready!");
});

export default redisClient;
