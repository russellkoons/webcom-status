'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);