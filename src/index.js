const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { usersService } = require('./services/index');
require('express-async-errors');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors({
  origin: process.env.CORS_FRONTEND_DOMAIN,
}));

app.use((err, request, response, next) => response.status(500).json({ errorMessage: err }));

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await usersService.createNewUser({ email, password });
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(400).json({ errorMessage: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
