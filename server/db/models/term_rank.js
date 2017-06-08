'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;
const Query = require('./query');
const Page = require('./page');
const Promise = require('bluebird');

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
          let totalRank = 0;
          query.terms.forEach(term => {
            if(page.terms.includes(term)) totalRank++;
          })
          return this.update({rank: totalRank});
        })
        .catch(console.error.bind(console));
    }
  },
  classMethods: {
    setRankFromQuery: function(query){
      return this.findAll({
        where: {
          queryId: query.id
        }
      })
        .then(termRankList => {
          return Promise.map(
            termRankList,
            term => term.setRank(query)
          );
        })
        .catch(console.error.bind(console));
    },
    setRelevance: function(query, page, rankIncrease){
      return this.findOne({
        where: {
          queryId: query.id,
          pageId: page.id
        }
      })
        .then(termRank => {
          let oldRank = termRank.rank;
          return termRank.update({rank: oldRank + rankIncrease})
        })
        .catch(console.error.bind(console));
    }
  }
});
