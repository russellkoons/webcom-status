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

router.delete('/:id', (req, res) => {
  Status
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleting lod ${req.params.id}`);
      res.status(204).json({ message: 'Successful deletion' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Deletion failed' });
    });
});

module.exports = { router }
