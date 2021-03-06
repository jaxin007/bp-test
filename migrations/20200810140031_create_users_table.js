/* eslint-disable no-shadow,consistent-return */
const knex = require('knex');

/**
 * @param {knex} knex
 */
exports.up = function (knex) {
  return knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email', 100).unique();
        table.bigInteger('phone').unique().defaultTo(null);
        table.string('password', 100).notNullable().defaultTo(null);
        table.integer('id_type', 1);
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
