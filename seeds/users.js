/* eslint-disable no-shadow */
const knex = require('knex');
const { hashPassword } = require('../src/utils/bcrypt');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const hash = await hashPassword('123');
  return knex('users').del()
    .then(() => {
      const seedUsers = [
        {
          email: 'dima@gmail.com',
          password: hash,
          id_type: 0,
        },
        {
          phone: '38096333222',
          password: hash,
          id_type: 1,
        },
      ];
      // Inserts seed entries
      return knex('users').insert([
        ...seedUsers,
      ]);
    });
};
