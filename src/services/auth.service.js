/* eslint-disable class-methods-use-this */
const jwt = require('jsonwebtoken');

class AuthService {
  async generateAccessToken(accessPayload) {
    const accessToken = await jwt.sign({ type: accessPayload || 'access' }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
    return accessToken;
  }

  async generateRefreshToken(refreshPayload) {
    const refreshToken = await jwt.sign({ type: refreshPayload || 'refresh' }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    return refreshToken;
  }

  async generateTokens(payloads) {
    const accessPayload = payloads || 'access';
    const refreshPayload = payloads || 'refresh';

    try {
      const accessToken = await this.generateAccessToken(accessPayload);
      const refreshToken = await this.generateRefreshToken(refreshPayload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifyToken(token) {
    try {
      const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      return verifiedToken;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = {
  AuthService,
};
