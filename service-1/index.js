// TRACING CONFIG
const { initTracer, useMung } = require('./../@edirect-tracing');
initTracer('service-1', 'localhost');
// /TRACING CONFIG

const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(useMung());

app.post('/posts', async (req, res) => {
  const SERVICE_2_URL = 'http://localhost:3001';
  const service2 = axios.create({ baseURL: SERVICE_2_URL });
  const response = await service2.post('/posts', req.body);

  try {
    res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.listen(3000, () => { 
  console.log('Service 1 ouvindo na porta 3000');
})