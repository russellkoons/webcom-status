'use strict';

const express = require('express');
const moment = require('moment');

const { Status } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  Status
    .find({})
    .then(statuses => {
      res.status(200).json(statuses.map(status => status.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'ruh roh' });
    });
});

router.post('/', (req, res) => {
  Status.create({
    user: req.body.user,
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
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
    date: moment().format('MMMM Do YYYY, h:mm:ss a'),
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

  Status.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(status => res.status(204).json(status.serialize()))
    .catch(() => res.status(500).json({ error: `Failed to update status ${req.params.id}` }));
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
