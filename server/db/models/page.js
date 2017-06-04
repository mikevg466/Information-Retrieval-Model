'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('page', {

  url: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
  },
  term_rank: {
    type: DataTypes.DOUBLE(),
  },
  page_rank: {
    type: DataTypes.DOUBLE(),
  },
}, {
  instanceMethods: {
    getFinalRank: function () {
    },
  }
});
