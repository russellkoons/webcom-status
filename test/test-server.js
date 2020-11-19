'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { Status, User } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const { internet } = require('faker');

chai.use(chaiHttp);

function seedStatus() {
  console.info('Seeding statuses to test server');
  const seedStatus = [];
  for (let i = 0; i < 5; i++) {
    seedStatus.push(generateStatus);
  }
  return Status.insertMany(seedStatus);
}

function generateStatus() {
  return {
    user: faker.random.findName(),
    date: new Date(),
    tasks: [faker.random.words(), faker.random.words()],
    enhancements: [
      {
        page: faker.random.word(),
        change: faker.random.words(),
      },
      {
        page: faker.random.word(),
        change: faker.random.words(),
      },
      {
        page: faker.random.word(),
        change: faker.random.words(),
      },
    ],
    builds: [
      {
        page: faker.random.word(),
        status: faker.random.word(),
        date: new Date(),
      },
      {
        page: faker.random.word(),
        status: faker.random.word(),
        date: new Date(),
      },
      {
        page: faker.random.word(),
        status: faker.random.word(),
        date: new Date(),
      },
    ],
    uploads: faker.random.number(),
    tickets: faker.random.number(),
    workflows: faker.random.number(),
    reports: faker.random.number(),
    mobileUpdates: faker.random.number(),
  }
}

function deleteDb() {
  console.warn('Deleting test database');
  return mongoose.connection.dropDatabase();
}

describe('Testing the server', () => {
  it('should respond', () => {
    return chai.request(app)
      .get('/')
      .then(res => expect(res).to.have.status(200));
  });
});