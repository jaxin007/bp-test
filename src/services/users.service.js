const { validator, userSchema } = require('./user.validator');
const { PostgresService } = require('./index');

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

    const user = {
      ...userData,
      id_type: idType,
    };

    const validateUser = await validator.validate(user, userSchema);
    if (validateUser !== true) throw validateUser[0];

    try {
      const newUser = await this
        .postgresService
        .knex('users')
        .insert(user)
        .returning('*');

      return newUser;
    } catch (err) {
      throw new Error('Duplicate email or phone');
    }
  }

  async getAllUsers() {
    const allUsers = await this
      .postgresService
      .knex('users')
      .select(['id', 'id_type'])
      .returning('*');

    return allUsers;
  }
}

module.exports = {
  UsersService,
};
