const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { estrategiasAutenticacao } = require('./src/usuarios'); //Dessa forma, após importarmos no index a nossa estrategiaAutenticacao, podemos utiliza-la aqui também, exportando dessa forma.

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;
