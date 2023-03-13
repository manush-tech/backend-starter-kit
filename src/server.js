import express from "express";
import env from "./lib/env";
import loader from "./loaders/loader";
const { PORT, NODE_ENV } = env();

const startServer = async () => {
  const app = express();

  loader(app);

  app.listen(PORT, (err) => {
    if (err) {
      process.exit(0);
    }
    console.log(`
          ####################################
          🔥  Server listening on port: ${PORT} 🔥
          ####################################
    `);
    console.log(`${NODE_ENV} environment started!`);
  });
};

startServer();
