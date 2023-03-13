import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import logger from "./logger";
// import loadApp from "../apps";

import env from "../lib/env";
import { isDevelopment } from "../utils/server";
import apps from "../apps";

const expressLoader = async (app) => {
  const whitelist = ["http://localhost:4000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (isDevelopment() || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      exposedHeaders: ["X-Refresh-Token"],
      optionsSuccessStatus: 200,
      credentials: isDevelopment() ? false : true,
    })
  );

  app.use(helmet());
  app.use(morgan("combined", { stream: logger.stream }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );

  app.enable("trust proxy");

  app.use(env().API_PREFIX, apps());
};

export default expressLoader;
