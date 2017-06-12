'use strict';

const db = require('../db');
const DataTypes = db.Sequelize;
const Promise = require('bluebird');
const Link = require('./link');

const Page = db.define('page', {

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
    },
    initializePageRank: function(){
      return this.findAll()
        .then(pageList => {
          const initRank = 1/pageList.length;
          return Promise.map(
            pageList,
            (page) => page.update({page_rank: initRank})
          );
        })
        .catch(console.error.bind(console));
    },
    updatePageRank: function(){
      return this.findAll()
        .then(pageList => {
          return Promise.map(
            pageList,
            (page) => {
              return page.getLinks()
            }
          )
            .then(linkListArr => {
              return Promise.map(
                linkListArr,
                (linkList, idx) => {
                  const incVal = linkList.length ? pageList[idx].page_rank / linkList.length : 0;
                  return Promise.map(
                    linkList,
                    link => link.incrementPageRank(incVal)
                  )
                }
              )
            })
        })
        .catch(console.error.bind(console));
    },
  },
  instanceMethods: {
    incrementPageRank: function(incVal){
      console.log(this.id, incVal);
      return this.update({page_rank: this.page_rank + incVal})
    },
    addLink: function(page){
      return Link.create({
        pageId: this.id,
        linkId: page.id
      })
      .catch(console.error.bind(console));
    },
    getLinks: function(){
      return Link.findAll({
        where: {
          pageId: this.id
        }
      })
        .then(linkList => {
          return Promise.map(
            linkList,
            link => Page.findById(link.linkId)
          )
        })
        .catch(console.error.bind(console));
    },
  },
});

module.exports = Page;
