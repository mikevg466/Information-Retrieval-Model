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
  terms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  term_rank: {
    type: DataTypes.DOUBLE(),
    defaultValue: 0.00,
  },
  page_rank: {
    type: DataTypes.DOUBLE(),
    defaultValue: 0.00,
  },
}, {
  getterMethods: {
    finalRank: function () {
      return (this.term_rank + this.page_rank) / 2;
    },
  },
  classMethods: {
    findWithTerms: function(terms) {
      terms += '';
      let termArr = terms.split(' ');
      termArr = termArr.filter(el => el.length > 0);
      return this.findAll({
        where: {
          terms: {
            $contains: termArr
          }
        }
      });
    },
    findAnyTerm: function(terms) {
      terms += '';
      let termArr = terms.split(' ');
      termArr = termArr.filter(el => el.length > 0);
      return this.findAll({
        where: {
          terms: {
            $overlap: termArr
          }
        }
      });
    }
  },
});
