'use strict';

const articleModel = (sequelize, DataTypes) => sequelize.define('Article', {
  author: { type: DataTypes.STRING, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: true },
  document: { type: DataTypes.TEXT, allowNull: true },
  page: { type: DataTypes.INTEGER, allowNull: true },
  keywords: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true }
});

module.exports = articleModel;
