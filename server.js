'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const { router: authRouter, local, jwt } = require('./auth');

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
app.use('/auth', authRouter);

passport.use(local);
passport.use(jwt);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Page not found' });
});

let server;

function runServer(databaseUrl, port = 42069) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`App listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer('mongodb://localhost/webcom').catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer }
