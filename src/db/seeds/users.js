const { hashSync } = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      email: "abir@manush.tech",
      name: "Abir Rahman",
      password: hashSync("kryptonite", 10),
    },
    {
      email: "jamilur@manush.tech",
      name: "Jamilur Rahman",
      password: hashSync("flash", 10),
    },
  ]);
};
