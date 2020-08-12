/* eslint-disable camelcase */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const axios = require('axios');
require('dotenv').config();
require('express-async-errors');
const { usersService, authService } = require('./services/index');
const { strategy } = require('./utils/passport-config');

passport.use(strategy);

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(passport.initialize());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors({
  origin: process.env.CORS_FRONTEND_DOMAIN,
}));

app.use((err, request, response, next) => response.status(500).json({ errorMessage: err }));

app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const allUsers = await usersService.getAllUsers();

  res.status(200).json(allUsers);
});

app.get('/info', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const token = req
    .headers
    .authorization
    .split(' ')[1]; // format of jwt token is 'Bearer <token'. We need only <token> info.

  const authData = await authService
    .verifyToken(token)
    .catch((err) => res.status(403).json({ errMessage: err }));

  const { id, id_type } = authData;

  const newTokens = await authService.generateTokens({ id, id_type });
  return res.json({ authData, newTokens });
});

app.get('/latency', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const timeOnBeginning = Date.now();

  const responseLatency = await axios.get('https://google.com')
    .then(() => Date.now() - timeOnBeginning)
    .catch((err) => console.error((err)));

  res.status(200).json({ latency: responseLatency });
});

app.post('/signup', async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await usersService.createNewUser(userData);
    const { id, id_type } = newUser;

    const tokens = await authService.generateTokens({ id, id_type });

    return res.json(tokens);
  } catch (err) {
    console.error(err);

    return res
      .status(400)
      .json({ errorMessage: err.message });
  }
});

app.post('/signin', async (req, res) => {
  const userData = req.body;

  const userByData = await usersService
    .getUserById(userData)
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({ errorMessage: 'wrong data' });
      }

      const { id, id_type } = user;
      const tokens = await authService.generateTokens({ id, id_type });

      return res.status(200).json(tokens);
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).json({ errorMessage: err });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
