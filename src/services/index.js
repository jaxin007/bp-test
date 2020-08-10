const { PostgresService } = require('./postgres.service');
const { UsersService } = require('./users.service');

const postgresService = new PostgresService();
const usersService = new UsersService(postgresService);

module.exports = {
  PostgresService,
  UsersService,
  usersService,
  postgresService,
};
