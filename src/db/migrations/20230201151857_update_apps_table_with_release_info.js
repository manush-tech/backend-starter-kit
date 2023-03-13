/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("apps", (table) => {
    table.string("uid").index().unique();
    table.string("build_name").defaultTo("1.0.0");
    table.string("build_number").defaultTo("1");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("apps", (table) => {
    table.dropColumn("uid");
    table.dropColumn("build_name");
    table.dropColumn("build_number");
  });
};
