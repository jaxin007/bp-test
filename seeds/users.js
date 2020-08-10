const knex = require('knex');

// eslint-disable-next-line no-shadow
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      const seedUsers = [
        {
          email: 'dima@gmail.com',
          password: '123',
        },
        {
          phone: '38096333222',
          password: '123',
        },
      ];
      // Inserts seed entries
      return knex('users').insert([
        ...seedUsers,
      ]);
    });
};
