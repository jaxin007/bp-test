const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.post('/home', (req, res) => {
  console.log(req.body);
  res.status(200).json({ Message: 'Hello, world!' });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
