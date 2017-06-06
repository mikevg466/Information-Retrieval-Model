'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;
const Query = require('./query');
const Page = require('./page');

module.exports = db.define('term_rank', {

  rank: {
    type: DataTypes.DOUBLE(),
    defaultValue: 0.00,
  },
},{
  instanceMethods: {
    setRank: function(query){
      return Page.findById(this.pageId)
        .then(page => {
          let totalRank = 0.00;
          query.terms.forEach(term => {
            if(page.terms.includes(term)) totalRank++;
          })
          console.log(totalRank);
          this.rank = totalRank;
          console.log(this.rank);
        })
        .catch(console.error.bind(console));
    }
  },
  classMethods: {
    setRankFromQuery: function(query){
      return TermRank.findAll({
        where: {
          queryId: query.id
        }
      })
        .then(term_rank => {
          // TODO: add in call to setRank instance method
        })
        .catch(console.error.bind(console));
    }
  }
});
