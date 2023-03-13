/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("apps", (table) => {
    table.bigIncrements("id").primary().index();
    table.string("name").notNullable().index().unique();
    table.string("description", 200);
    table.string("public_url");
    table.string("repo_url");
    table.bigInteger("created_by").notNullable().index();
    table
      .foreign("created_by")
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
  return knex.schema.dropTable("apps");
};
