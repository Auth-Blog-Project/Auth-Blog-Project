'use strict';

const pageModel = (sequelize, DataTypes) => sequelize.define('Pages', {
  topic: { type: DataTypes.STRING, allowNull: false },
});

module.exports = pageModel;


