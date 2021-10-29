'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { articles } = require('../models');


const dataModules = require('../models');

const acl = require('../middleware/auth/acl');
const bearerAuth = require('../middleware/auth/bearer');

router.use( (req, res, next) => {
  const modelName = 'articles';
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/pages/:page_id/articles', bearerAuth, acl('read'), handleGetAll);
router.get('/pages/:page_id/articles/:article_id', bearerAuth, acl('read'), handleGetOne);
router.post('/pages/:page_id/articles', bearerAuth, acl('create'), handleCreate);
router.put('/pages/:page_id/articles/:article_id', bearerAuth, acl('update'), handleUpdate);
router.delete('/pages/:page_id/articles/:article_id', bearerAuth, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.article_id;
  req.body.page_id = req.params.page_id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  req.body.page = req.params.page_id;
  jwt.verify(req.token, process.env.SECRET, function(err, decoded) {
    req.body.author = decoded.username
  });
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.article_id;
  const obj = req.body;
  let oldArticle = null;
  try {
  oldArticle = await articles.get(id);
} catch(e) {
  console.log(e);
}
  let updatedRecord = await req.model.update(id, obj, oldArticle.author); 
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.article_id;
  await req.model.delete(id);
  res.status(200).json({});
}

module.exports = router;