'use strict';

const Page = require('./page');
const Query = require('./query');
const TermRank = require('./term_rank');

Page.belongsToMany(Query, {through: TermRank});
Query.belongsToMany(Page, {through: TermRank});

module.exports = {
  Page,
  Query,
  TermRank,
};
