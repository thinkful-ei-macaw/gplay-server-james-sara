const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const data = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(validateAuthorization);
app.use(cors());

function validateAuthorization(req, res, next) {
  const authValue = req.get('Authorization');
  if (authValue === undefined) {
    return res.status(400).json({ error: 'Authorization header missing' });
  }

  if (!authValue.toLowerCase().startsWith('bearer ')) {
    return res.status(400).json({ error: 'Invalid Authorization method: Must use Bearer strategy' });
  }

  const token = authValue.split(' ')[1];

  if (token !== API_TOKEN) {
      return res.status(401).json({ error: 'Invalid credentials' });
  }
}


app.get( '/movie', req, res);
