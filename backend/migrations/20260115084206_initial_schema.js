/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username").unique().notNullable();
      table.string("password").notNullable();
    })
    .createTable("projects", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    })
    .createTable("todos", (table) => {
      table.increments("id").primary();
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("title").notNullable();
      table.text("description");
      table.enu("priority", ["low", "medium", "high"]).defaultTo("medium");
      table.boolean("completed").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("completed_at");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("todos")
    .dropTableIfExists("projects")
    .dropTableIfExists("users");
};
