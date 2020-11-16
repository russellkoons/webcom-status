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

  const sized = {
    username: {
      min: 1,
      max: 16,
    },
    password: {
      min: 8,
      max: 72,
    },
  }

  const tooSmall = Objext.keys(sized).find(field => 
    'min' in sized[field] &&
    req.body[field].trim().length < sized[field].min
  );
  const tooLarge = Objext.keys(sized).find(field => 
    'max' in sized[field] &&
    req.body[field].trim().length > sized[field].max
  );

  if (tooLarge || tooSmall) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmall ? `Must be at least ${sized[tooSmall].min} characters long` : `Must be at most ${sized[tooLarge].max} characters long`,
      location: tooSmall || tooLarge,
    });
  }
});

module.exports = { router }
