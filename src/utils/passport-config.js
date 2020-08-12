const passportJWT = require('passport-jwt');
require('dotenv').config();

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  next(null, payload);
});

module.exports = {
  strategy,
};
