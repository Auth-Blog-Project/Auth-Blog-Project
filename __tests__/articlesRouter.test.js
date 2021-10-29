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
  it('can allow those with writer permissions to add posts to a specific page', async (done) => {
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
    expect(res.body.title).toBe('The Lord of the Rings: The Fellowship of the Ring');
    expect(res.body.document).toBe('Elit reprehenderit irure culpa quis id in laborum laborum.');
    expect(res.body.keywords).toEqual(['adventure', 'fantasy']);


    const token3 = jwt.sign(users['user'], process.env.SECRET);
    await server.post('/signup').send(users['user']);
  
    let res2 = await server.post('/pages/1/articles')
      .set('Authorization', 'Bearer ' + token3).send(movie1);

    expect(res2.status).toBe(500);

    done();
  });

  it('can view one article on a page, and view all articles on a page', async (done) => {
    const token = jwt.sign(users['user'], process.env.SECRET);
    await server.post('/signup').send(users['user']);

    let res = await server.get('/pages/1/articles')
      .set('Authorization', 'Bearer ' + token);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(2);

    let res2 = await server.get('/pages/1/articles/3')
      .set('Authorization', 'Bearer ' + token);
 
    expect(res2.status).toBe(200);
    expect(res2.body.title).toBe('The Lord of the Rings: Return of the King');
    expect(res2.body.id).toBe(3);
    expect(res2.body.document).toBe('Elit reprehenderit irure culpa quis id in laborum laborum.');
    expect(res2.body.keywords).toEqual('adventure,fantasy');

    done();
  });

  it('can allow those with update permissions can edit articles', async (done) => {
    const token = jwt.sign(users['writer'], process.env.SECRET);
    await server.post('/signup').send(users['writer']);

    const token2 = jwt.sign(users['user'], process.env.SECRET);
    await server.post('/signup').send(users['user']);

    const movie1 = {title: 'Elf', document: 'Elit reprehenderit irure culpa quis id in laborum laborum.', keywords: ['adventure', 'comedy'] };

    let res = await server.put('/pages/1/articles/3')
      .set('Authorization', 'Bearer ' + token).send(movie1);

    let res2 = await server.put('/pages/1/articles/3')
      .set('Authorization', 'Bearer ' + token2).send(movie1);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Elf');
    expect(res.body.id).toBe(3);
    expect(res.body.document).toBe('Elit reprehenderit irure culpa quis id in laborum laborum.');
    expect(res.body.keywords).toEqual(['adventure','comedy']);

    expect(res2.status).toBe(500);

    done();
  });

  it('can allow those with delete permissions can delete articles', async (done) => {
    const token = jwt.sign(users['admin'], process.env.SECRET);
    await server.post('/signup').send(users['admin']);

    const token2 = jwt.sign(users['user'], process.env.SECRET);
    await server.post('/signup').send(users['user']);

    let res = await server.delete('/pages/1/articles/3')
      .set('Authorization', 'Bearer ' + token);

    let res2 = await server.delete('/pages/1/articles/1')
      .set('Authorization', 'Bearer ' + token2);

    expect(res.status).toBe(200);
    expect(res2.status).toBe(500);

    done();
  });
});
