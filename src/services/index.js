const { PostgresService } = require('./postgres.service');
const { UsersService } = require('./users.service');
const { AuthService } = require('./auth.service');

const postgresService = new PostgresService();
const usersService = new UsersService(postgresService);
const authService = new AuthService();

module.exports = {
  PostgresService,
  UsersService,
  AuthService,
  usersService,
  postgresService,
  authService,
};
