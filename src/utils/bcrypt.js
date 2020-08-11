const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(`${password}`, 1);
  return hash;
}

async function checkPasswords(userPassword, hashedPassword) {
  try {
    const chekedPasswords = await bcrypt.compare(`${userPassword}`, `${hashedPassword}`);

    return chekedPasswords;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  hashPassword,
  checkPasswords,
};
