'use strict';

const db = require('../db');
const Page = require('./page');
const TermRank = require('./term_rank');
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
    },
  },
  instanceMethods: {
    updateRanks: function(){
      return Page.findAnyTerm(this.name)
        .then(pages => {
          return Promise.all(pages.map(page => this.addPage(page)));
        })
        .then(() => TermRank.setRankFromQuery(this))
        .then(() => this)
        .catch(console.error.bind(console));
    },
    updateRelevance: function(pageInput){
      return Page.findAnyTerm(pageInput.terms.join(' '))
        .then(pageList => {
          const rankIncreaseList = pageList.map(curPage => {
            let curTermCount = 0;
            pageInput.terms.forEach(term => {
              if(curPage.terms.includes(term)) curTermCount++;
            });
            return curTermCount ? Number(Math.round((curTermCount / pageInput.terms.length )+'e2')+'e-2') : 0;
          });
          return Promise.all(pageList.map((curPage, idx) => TermRank.setRelevance(this, curPage, rankIncreaseList[idx])));
        })
    }
  }
});
