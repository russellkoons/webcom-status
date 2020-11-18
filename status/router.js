'use strict';

const { static } = require('express');
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

router.post('/', (req, res) => {
  Status.create({
    user: req.body.user,
    tasks: req.body.tasks,
    audits: req.body.audits,
    enhancements: req.body.enhancements,
    builds: req.body.builds,
    uploads: req.body.uploads,
    tickets: req.body.tickets,
    workflows: req.body.workflows,
    reports: req.body.reports,
    mobileUpdates: req.body.mobileUpdates,
  })
    .then(status => res.status(201).json(status.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'ohhh nooooooo' });
    });
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path ID and body ID must match',
    });
  }
  const updated = {
    tasks: req.body.tasks,
    audits: req.body.audits,
    enhancements: req.body.enhancements,
    builds: req.body.builds,
    uploads: req.body.uploads,
    tickets: req.body.tickets,
    workflows: req.body.workflows,
    reports: req.body.reports,
    mobileUpdates: req.body.mobileUpdates,
  }
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
