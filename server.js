'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Origin', 'Content-Type.Authorization');
  res.header('Access-Control-Allow-Origin', 'GET,POST,PUT,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' });
});

