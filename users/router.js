'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('../models');

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const trimmed = ['username', 'password'];
  const notTrimmed = trimmed.find(field => req.body[field].trim() !== req.body[field]);

  
});

module.exports = { router }
