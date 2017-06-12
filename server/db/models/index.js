'use strict';

const Page = require('./page');
const Query = require('./query');
const TermRank = require('./term_rank');
const Link = require('./link');

Page.belongsToMany(Query, {through: TermRank});
Query.belongsToMany(Page, {through: TermRank});

Page.belongsToMany(Page, {as: 'link', through: Link});

module.exports = {
  Page,
  Query,
  TermRank,
};
