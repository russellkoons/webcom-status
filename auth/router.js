'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const router = express.Router();


