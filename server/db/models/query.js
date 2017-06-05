'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('term_rank', {

  rank: {
    type: DataTypes.DOUBLE(),
    defaultValue: 0.00,
  },
});
