'use strict';

process.env.SECRET = 'secret123';

const supertest = require('supertest');
const app = require('../src/server.js');
const server = supertest(app.server);
const jwt = require('jsonwebtoken');

const { db } =  require('../src/models');

beforeAll(async (done) => {
  await db.sync();
  done();
});

afterAll(async (done) => {
  await db.drop();
  done();
});

let users = {
  admin: { username: 'admin1', password: 'password', role: 'admin' },
  user: { username: 'user', password: 'password', role: 'user' },
  writer: { username: 'writer', password: 'password', role: 'writer' },
};

describe('Articles Router with Auth', () => {
  // it('can writer to add posts to a specific page', async (done) => {
  //   //create some pages to add articles to for tests that follow
  //   const token = jwt.sign(users['admin'], process.env.SECRET);
  //   await server.post('/signup').send(users['admin']);

  //   const page1 = {'topic': 'movies'};
  //   const page2 = {'topic': 'cars'};
  //   const page3 = {'topic': 'places'};

    // await server.post('/pages')
    //   .set('Authorization', 'Bearer ' + token).send(page1);
    // await server.post('/pages')
    //   .set('Authorization', 'Bearer ' + token).send(page2);  
    // await server.post('/pages')
    //   .set('Authorization', 'Bearer ' + token).send(page3);


    // const movie1 = {title: 'The Lord of the Rings: The Fellowship of the Ring', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    // const movie2 = {title: 'The Lord of the Rings: The Two Towers', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    // const movie3 = {title: 'The Lord of the Rings: Return of the King', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    // const token2 = jwt.sign(users['writer'], process.env.SECRET);
    
    // await server.post('/signup').send(users['writer']);

    // let res = await server.get('/')
    //   .set('Authorization', 'Bearer ' + token2).send(movie1);

    // server.get('/pages/1/articles').set('Authorization', 'Bearer ' + token2).send(movie1)
    // .then(res => console.log("RES", res)).catch(err => console.log(err));



    // await server.post('/pages/1/articles')
    //   .set('Authorization', 'Bearer ' + token2).send(movie2);
    // await server.post('/pages/1/articles')
    //   .set('Authorization', 'Bearer ' + token2).send(movie3);

    //expect(res.status).toBe(201);
  // });
});
