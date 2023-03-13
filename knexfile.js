const appRoot = require("app-root-path");
const { knexSnakeCaseMappers } = require("objection");
const dotenv = require("dotenv");
const path = require("path");

const env = dotenv.config({
  path: path.join(appRoot.path, "config", `.env.${process.env.NODE_ENV}`),
}).parsed;

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      port: env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds",
    },
    debug: true,
    pool: { min: 5, max: 10 },

    ...knexSnakeCaseMappers(),
  },

  staging: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      port: env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds",
    },
    debug: true,
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: "pg",
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      port: env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds",
    },
    ...knexSnakeCaseMappers(),
  },
};
