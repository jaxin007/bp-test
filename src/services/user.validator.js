const Validator = require('fastest-validator');

const validator = new Validator();

const userSchema = {
  email: {
    type: 'email', min: 3, max: 100, optional: true,
  },
  phone: {
    type: 'string', min: 3, max: 20, required: false, optional: true,
  },
  password: {
    type: 'string', min: 3, max: 100,
  },
};

module.exports = {
  validator,
  userSchema,
};
