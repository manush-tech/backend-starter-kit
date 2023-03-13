import Knex from "knex";
import { Model } from "objection";

import knexConfig from "../../knexfile";

import env from "../lib/env";
import logger from "./logger";

const loadDatabase = () => {
  const knex = Knex(knexConfig[env().NODE_ENV]);
  Model.knex(knex);

  knex
    .raw("select version()")
    .then((_) => {
      logger.info("Database Connection Established!");
    })
    .catch((err) => {
      logger.error(err);
      logger.error("Database Connection Failed!");
    });

  return knex;
};

export default loadDatabase;
