import loadDatabase from "./database";
import expressLoader from "./express";

export default (app) => {
  loadDatabase();

  expressLoader(app);
};
