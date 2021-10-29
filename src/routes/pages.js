'use strict';

const express = require('express');
const router = express.Router();

const dataModules = require('../models');

const acl = require('../middleware/auth/acl');
const bearerAuth = require('../middleware/auth/bearer');

router.use( (req, res, next) => {
  const modelName = 'pages';
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/', bearerAuth, acl('read'), handleGetAll);
router.get('/:page_id', bearerAuth, acl('read'), handleGetOne);
router.post('/', bearerAuth, acl('delete'), handleCreate);
router.put('/:page_id', bearerAuth, acl('delete'), handleUpdate);
router.delete('/:page_id', bearerAuth, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.page_id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.page_id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.page_id;
  await req.model.delete(id);
  res.status(200).json({});
}

module.exports = router;