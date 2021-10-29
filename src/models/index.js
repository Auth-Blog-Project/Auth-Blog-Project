'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const pageModel = require('./pages.js');
const userModel = require('./users.js');
const articleModel = require('./articles.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory';

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false,
  },
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);
const articles = articleModel(sequelize, DataTypes);
const pages = pageModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

articles.belongsTo(users);
articles.belongsTo(pages);

module.exports = {
  db: sequelize,
  articles: new Collection(articles),
  pages: new Collection(pages),
  users: new Collection(users)
};
