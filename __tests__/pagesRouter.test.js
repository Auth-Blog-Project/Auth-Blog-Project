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
  admin: { username: 'admin', password: 'password', role: 'admin' },
  user: { username: 'user', password: 'password', role: 'user' },
  writer: { username: 'writer', password: 'password', role: 'writer' },
};

describe('Pages Router with Auth', () => {
    it('can allow an admin to create, update, and destroy pages', async (done) => {
      const token = jwt.sign(users['admin'], process.env.SECRET);
      await server.post('/signup').send(users['admin']);
  
      const page1 = {'topic': 'movies'};

      const res = await server.post('/pages')
        .set('Authorization', 'Bearer ' + token).send(page1);

      //create
      expect(res.statusCode).toBe(201);
      expect(res.body.topic).toBe(page1.topic);

      // //update
      await server.put('/pages/1')
        .set('Authorization', 'Bearer ' + token).send({'topic': 'animals'});

      const res2 = await server.get('/pages/1')
        .set('Authorization', 'Bearer ' + token);
      expect(res2.statusCode).toBe(200);
      expect(res2.body.topic).toBe('animals');
      
      // //delete
      const res3 = await server.delete('/pages/2')
        .set('Authorization', 'Bearer ' + token);

      expect(res3.statusCode).toBe(200);
      expect(res3.body).toEqual({});
      done();
    });

    it('can prevent non-admin users from deleting, writing, and updating a page', async (done) => {
      const token = jwt.sign(users['writer'], process.env.SECRET);
      await server.post('/signup').send(users['writer']);

      const page1 = {'topic': 'movies'};

      const res = await server.post('/pages')
        .set('Authorization', 'Bearer ' + token).send(page1);

      //create
      expect(res.statusCode).toBe(500);

      // //update
      const res2 = await server.put('/pages/1')
        .set('Authorization', 'Bearer ' + token).send({'topic': 'animals'});

      expect(res2.statusCode).toBe(500);

      // //delete
      const res3 = await server.delete('/pages/2')
        .set('Authorization', 'Bearer ' + token);

      expect(res3.statusCode).toBe(500);
      done();
    });

    it('can writer to add posts to a specific page', async (done) => {
    //create some pages to add articles to for tests that follow
    const token = jwt.sign(users['admin'], process.env.SECRET);
    await server.post('/signup').send(users['admin']);

    const page1 = {'topic': 'movies'};
    const page2 = {'topic': 'cars'};
    const page3 = {'topic': 'places'};

    await server.post('/pages')
      .set('Authorization', 'Bearer ' + token).send(page1);
    await server.post('/pages')
      .set('Authorization', 'Bearer ' + token).send(page2);  
    await server.post('/pages')
      .set('Authorization', 'Bearer ' + token).send(page3);


    const movie1 = {title: 'The Lord of the Rings: The Fellowship of the Ring', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    const movie2 = {title: 'The Lord of the Rings: The Two Towers', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    const movie3 = {title: 'The Lord of the Rings: Return of the King', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'fantasy'] };
    const token2 = jwt.sign(users['writer'], process.env.SECRET);
    
    await server.post('/signup').send(users['writer']);

    let res = await server.post('/pages/1/articles')
      .set('Authorization', 'Bearer ' + token2).send(movie1);

    await server.post('/pages/1/articles')
      .set('Authorization', 'Bearer ' + token2).send(movie2);
    await server.post('/pages/1/articles')
      .set('Authorization', 'Bearer ' + token2).send(movie3);

    expect(res.status).toBe(201);
    done();
  });
});
