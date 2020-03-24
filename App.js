require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');


const data = require('./movies-data-small.json');
const API_TOKEN = process.env.API_TOKEN;

const app = express();

app.use(morgan('dev'));
app.use(validateAuthorization);
app.use(helmet());
app.use(cors());

console.log(API_TOKEN);

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
  next();
}

function handleTypes(req, res) {
  const { movie } = req.query;

  if(!movie) {
    return res  
      .send(data);
  }

  if (movie) {
    if(!['movie'].includes(movie)) {
      return res  
        .status(400)
        .send('Genre must be one of genre, country or avg_vote');
    }
  }
}

app.get( '/movie', validateAuthorization, handleTypes);


app.listen(8080, () => {
  console.log('Server started on PORT 8080');
});