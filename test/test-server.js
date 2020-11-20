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

chai.use(chaiHttp);

function seedStatus() {
  console.info('Seeding statuses to test server');
  const seedStatus = [];
  for (let i = 0; i < 5; i++) {
    seedStatus.push(generateStatus());
  }
  return Status.insertMany(seedStatus);
}

function generateStatus() {
  return {
    user: faker.random.word(),
    date: new Date(),
    tasks: [faker.random.words(), faker.random.words()],
    audits: [faker.random.word(), faker.random.word()],
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
        date: '11/20/20',
      },
      {
        page: faker.random.word(),
        status: faker.random.word(),
        date: '11/20/20',
      },
      {
        page: faker.random.word(),
        status: faker.random.word(),
        date: '11/20/20',
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

describe('Status Router', () => {
  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(() => {
    return seedStatus();
  });

  afterEach(() => {
    return deleteDb();
  });

  after(() => {
    return closeServer();
  });

  describe('GET endpoint', () => {
    it('should return statuses', () => {
      let res;
      return chai.request(app)
        .get('/status')
        .then(r => {
          res = r;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Status.countDocuments();
        })
        .then(count => {
          expect(res.body).to.have.length(count);
        });
    });

    it('should return statuses with the right fields', () => {
      let status;
      return chai.request(app)
        .get('/status')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(stat => {
            expect(stat).to.be.a('object');
            expect(stat).to.include.keys(
              'id', 'user', 'date', 'tasks', 'audits', 'enhancements', 'builds', 'uploads', 'tickets', 'workflows', 'reports', 'mobileUpdates'
            );
            expect(stat.enhancements[0]).to.include.keys(
              'page', 'change'
            );
            expect(stat.enhancements[1]).to.include.keys(
              'page', 'change'
            );
            expect(stat.enhancements[2]).to.include.keys(
              'page', 'change'
            );
            expect(stat.builds[0]).to.include.keys(
              'page', 'status', 'date'
            );
            expect(stat.builds[1]).to.include.keys(
              'page', 'status', 'date'
            );
            expect(stat.builds[2]).to.include.keys(
              'page', 'status', 'date'
            );
          })
          status = res.body[0];
          return Status.findById(status.id);
        })
        .then(s => {
          expect(status.id).to.equal(s.id);
          expect(status.user).to.equal(s.user);
          expect(status.date).to.equal(s.date);
          expect(status.tasks[0]).to.equal(s.tasks[0]);
          expect(status.tasks[1]).to.equal(s.tasks[1]);
          expect(status.audits[0]).to.equal(s.audits[0]);
          expect(status.audits[1]).to.equal(s.audits[1]);
          expect(status.enhancements[0].page).to.equal(s.enhancements[0].page);
          expect(status.enhancements[0].change).to.equal(s.enhancements[0].change);
          expect(status.enhancements[1].page).to.equal(s.enhancements[1].page);
          expect(status.enhancements[1].change).to.equal(s.enhancements[1].change);
          expect(status.enhancements[2].page).to.equal(s.enhancements[2].page);
          expect(status.enhancements[2].change).to.equal(s.enhancements[2].change);
          expect(status.builds[0].page).to.equal(s.builds[0].page);
          expect(status.builds[0].status).to.equal(s.builds[0].status);
          expect(status.builds[0].date).to.equal(s.builds[0].date);
          expect(status.builds[1].page).to.equal(s.builds[1].page);
          expect(status.builds[1].status).to.equal(s.builds[1].status);
          expect(status.builds[1].date).to.equal(s.builds[1].date);
          expect(status.builds[2].page).to.equal(s.builds[2].page);
          expect(status.builds[2].status).to.equal(s.builds[2].status);
          expect(status.builds[2].date).to.equal(s.builds[2].date);
          expect(status.uploads).to.equal(s.uploads);
          expect(status.tickets).to.equal(s.tickets);
          expect(status.workflows).to.equal(s.workflows);
          expect(status.reports).to.equal(s.reports);
          expect(status.mobileUpdates).to.equal(s.mobileUpdates);
        });
    });
  });

  describe('POST endpoint', () => {

  });

  describe('PUT endpoint', () => {

  });

  describe('DELETE endpoint', () => {
    it('delete status by id', () => {
      let status;
      return Status
        .findOne()
        .then(stat => {
          status = stat;
          return chai.request(app).delete(`/status/${status.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Status.findById(status.id);
        })
        .then(stat => {
          expect(stat).to.be.null;
        });
    });
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

describe('Auth Router', () => {
  const username = 'testUser';
  const password = 'uuuggghHHHH';

  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  beforeEach(() => {
    return User.hashPassword(password).then(password => 
      User.create({
        username,
        password
      })
    );
  });

  afterEach(() => {
    return User.deleteOne({});
  });

  describe('Login', () => {
    it('Should reject empty requests', () => {
      return chai
        .request(app)
        .post('/auth/login')
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(400);
        });
    });

    it('should reject incorrect usernames', () => {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username: 'wrongo', password })
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    
    it('should reject incorrect passwords', () => {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password: 'wrongo' })
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('should return a valid auth token', () => {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({username});
        });
    });
  });

  describe('Refresh', () =>{
    it('should reject empty requests', () => {
      return chai
        .request(app)
        .post('/auth/refresh')
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('should reject invalid tokens', () => {
      const token = jwt.sign(
        {
          username
        },
        'wrongofriendo',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('should reject expired tokens', () => {
      const token = jwt.sign(
        {
         username
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: Math.floor(Date.now() / 1000) - 10
        }
      );
      return chai
        .request(app)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('should return a newer token', () => {
      return chai
      .request(app)
      .post('/auth/login')
      .send({ username, password })
      .then(res => {
        const decoded = jwt.decode(res.body.authToken);
        return chai
          .request(app)
          .post('/auth/refresh')
          .set('Authorization', `Bearer ${res.body.authToken}`)
          .then(_res => {
            expect(_res).to.have.status(200);
            expect(_res.body).to.be.a('object');
            const token = _res.body.authToken;
            expect(token).to.be.a('string');
            const payload = jwt.verify(token, JWT_SECRET, {
              algorithm: ['HS256']
            });
            expect(payload.user).to.deep.equal({username});
            expect(payload.exp).to.be.at.least(decoded.exp);
          });
      });
    });
  });
});