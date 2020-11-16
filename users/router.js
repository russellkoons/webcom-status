'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('../models');

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const trimmed = ['username', 'password'];
  const notTrimmed = trimmed.find(field => req.body[field].trim() !== req.body[field]);

  if (notTrimmed) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Username and Password cannot have whitespace',
      location: notTrimmed,
    });
  }

  
});

module.exports = { router }
