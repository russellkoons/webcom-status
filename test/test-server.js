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

describe('User Router', () => {
  const username = 'testUser';
  const password = 'password';

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  afterEach(() => {
    return User.deleteOne({});
  });

  describe('POST endpoint', () => {
    it('Should reject users with nontrimmed username', () => {
      return chai
        .request(app)
        .post('/users')
        .send({
          username: ` ${username} `,
          password
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          };
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Username and Password cannot have whitespace');
          expect(res.body.location).to.equal('username');
        });
    });

    it('Should reject users with a nontrimmed password', () => {
      return chai
      .request(app)
      .post('/users')
      .send({
        username,
        password: ` ${password} `
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        };
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Username and Password cannot have whitespace');
        expect(res.body.location).to.equal('password');
      });
    });

    it('Should reject users with too short username', () => {
      return chai
      .request(app)
      .post('/users')
      .send({
        username: '',
        password
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        };
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Must be at least 1 characters long');
        expect(res.body.location).to.equal('username');
      });
    });

    it('Should reject users with too long of a username', () => {
      return chai
      .request(app)
      .post('/users')
      .send({
        username: 'ReallyLongUsernameMcgee',
        password
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        };
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Must be at most 16 characters long');
        expect(res.body.location).to.equal('username');
      });
    });

    it('Should reject users with too short of a password', () => {
      return chai
      .request(app)
      .post('/users')
      .send({
        username,
        password: 'hello'
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        };
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Must be at least 8 characters long');
        expect(res.body.location).to.equal('password');
      });
    });

    it('Should reject users with too long of a password', () => {
      return chai
      .request(app)
      .post('/users')
      .send({
        username,
        password: new Array(73).fill('a').join('')
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        };
        const res = err.response;
        expect(res).to.have.status(422);
        expect(res.body.reason).to.equal('ValidationError');
        expect(res.body.message).to.equal('Must be at most 72 characters long');
        expect(res.body.location).to.equal('password');
      });
    });

    it('Should create a new user', () => {
      return chai
        .request(app)
        .post('/users')
        .send({
          username,
          password
        })
        .then(res => {
          console.log(res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('username');
          expect(res.body.username).to.equal(username);
          return User.findOne({username});
        })
        .then(user => {
          expect(user).to.not.be.null;
          return user.validatePassword(password);
        })
        .then(correct => {
          expect(correct).to.be.true;
        });
    });
  });
});