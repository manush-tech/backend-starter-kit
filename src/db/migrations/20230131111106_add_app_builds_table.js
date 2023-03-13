/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("app_builds", (table) => {
    table.bigIncrements("id").primary().index();
    table.bigInteger("app_id").notNullable().index();
    table
      .foreign("app_id")
      .references("id")
      .inTable("apps")
      .onDelete("CASCADE");
    table.string("build_name").defaultTo("1.0.0");
    table.string("build_number").defaultTo("1");
    table.enu("build_flavor", ["dev", "stage", "prod"]).defaultTo("dev");
    table.string("display_version").defaultTo("1.0.0-dev+1");
    table.string("app_url");
    table.bigInteger("uploaded_by").notNullable().index();
    table
      .foreign("uploaded_by")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamps(false, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("app_builds");
};
