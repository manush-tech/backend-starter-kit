import dotenv from "dotenv";
import approot from "app-root-path";
import path from "path";

export default () => {
  return dotenv.config({
    path: path.join(approot.path, "config", `.env.${process.env.NODE_ENV}`),
  }).parsed;
};
