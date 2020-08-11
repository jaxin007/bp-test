const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const axios = require('axios');
require('dotenv').config();
const { usersService } = require('./services/index');
require('express-async-errors');

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  next(null, payload);
});

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

app.get('/users', async (req, res) => {
  const allUsers = await usersService.getAllUsers();

  res.status(200).json(allUsers);
});

app.get('/info', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const token = req
    .headers
    .authorization
    .split(' ')[1]; // format of jwt token is 'Bearer <token'. We need only <token> info.

  await jwt.verify(token, '123', (err, authData) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ errMessage: err });
    }

    return res.json({ authData });
  });
});

app.get('/latency', async (req, res) => {
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

    const JwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ id: newUser.id, id_type: newUser.id_type }, JwtSecretKey, { expiresIn: '10m' });

    return res.json({ token });
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
    .then((user) => {
      if (!user) {
        return res.status(401).json({ errorMessage: 'wrong data' });
      }

      const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).json({ errorMessage: err });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
