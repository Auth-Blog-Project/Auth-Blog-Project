'use strict';

const { db } =  require('../src/models');
const supertest = require('supertest');
const app = require('../src/server.js');
const server = supertest(app.server);

beforeAll(async (done) => {
  await db.sync();
  done();
});

afterAll(async (done) => {
  await db.drop();
  done();
});

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
  writer: { username: 'writer', password: 'password', role: 'writer' },
};


describe('Testing ability to create and authenticated users', () => {
  //auth routes
  it('can create a new user and sends an object with the user and the token to the client', async (done) => {
    const response = await server.post('/signup').send(users['user']);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(users['user'].username);
    done();
  });

  
  it('can log in a user and sends an object with the user and token to the client', async (done) => {
    const response = await server.post('/signin')
      .auth(users['user'].username, users['user'].password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(users['user'].username);
    done();
  });
});
