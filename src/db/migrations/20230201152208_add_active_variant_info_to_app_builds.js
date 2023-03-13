/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("app_builds", (table) => {
    table.string("uid").index().unique();
    table.boolean("is_active").defaultTo(false);
    table.enu("build_type", ["ANDROID", "IOS"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("app_builds", (table) => {
    table.dropColumn("uid");
    table.dropColumn("is_active");
    table.dropColumn("build_type");
  });
};
