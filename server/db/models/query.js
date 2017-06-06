'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('query', {

  name: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  terms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
},{
  classMethods: {
    findOrCreateQuery: function(terms){
      terms.sort();
      return this.findOrCreate({
        where: {
          name: terms.join(' ')
        },
        defaults: {
          terms
        }
      });
    }
  }
});
