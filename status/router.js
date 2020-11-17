'use strict';

const express = require('express');
const moment = require('moment');

const { Status } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  Status
    .find()
    .then(status => {
      res.json(status => status.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'ruh roh' });
    });
});

module.exports = { router }
