// TRACING CONFIG
const { initTracer, useMung } = require('./../@edirect-tracing');
initTracer('service-2', 'localhost');
// /TRACING CONFIG

const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(useMung());

app.post('/posts', async (req, res) => {
  const post = req.body;
  const response = await axios.post('https://jsonplaceholder.typicode.com/posts', post);

  // throw new Error('Service 2 Error: Something happened...');

  res.status(response.status).json(response.data);
});

app.listen(3001, () => {
  console.log('Service 2 ouvindo na porta 3001');
});