/* eslint-disable consistent-return,no-param-reassign */
const { validator, userSchema } = require('./user.validator');
const { PostgresService } = require('./index');
const { checkPasswords, hashPassword } = require('../utils/bcrypt');

class UsersService {
  /**
   * @param {PostgresService} postgresService
   */
  constructor(postgresService) {
    this.postgresService = postgresService;
  }

  async createNewUser(userData) {
    let idType;

    if (!userData.email && !userData.phone) {
      throw new Error('Enter phone or email');
    } else if (userData.email) {
      idType = 0;
    } else if (userData.phone) {
      idType = 1;
    }

    const { password } = userData;
    const hashedPassword = await hashPassword(password);

    delete userData.password;

    const user = {
      ...userData,
      password: hashedPassword,
      id_type: idType,
    };

    const validateUser = await validator.validate(user, userSchema);
    if (validateUser !== true) throw validateUser[0];

    try {
      const newUser = await this.postgresService
        .knex('users')
        .insert(user)
        .returning('*');

      return newUser[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  }

  async getUserById(userData) {
    try {
      const { id, password } = userData;

      const userById = await this.postgresService
        .knex('users')
        .where('id', id)
        .first()
        .returning('*')
        .then(async (user) => {
          if (await checkPasswords(password, user.password)) return user;
        });

      return userById;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllUsers() {
    const allUsers = await this.postgresService
      .knex('users')
      .returning('*');

    return (allUsers);
  }
}

module.exports = {
  UsersService,
};
