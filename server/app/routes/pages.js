const express = require('express');
const router = new express.Router();
const Page = require('../../db/models/page');
const Query = require('../../db/models/query');
const TermRank = require('../../db/models/term_rank');

module.exports = router;

router.get('/', (req, res, next) => {
  if(req.query && Object.keys(req.query).length > 0){
    Page.findWithTerms(req.query.terms)
      .then(pages => {
        res.status(200).json(pages);
      })
      .catch(next);
  } else{
    Page.findAll()
      .then(pages => res.status(200).json(pages))
      .catch(next);
  }
});

router.get('/vectorSearch', (req, res, next) => {
  if(req.query && Object.keys(req.query).length > 0){
    Query.findOrCreateQuery(req.query.terms.split(' '))
      .then(([query]) => query.updateRanks())
      .then(query =>
        Page.findAnyTerm(req.query.terms)
          .then(pages => {
            return Promise.all(
              pages.map(page =>
                TermRank.findOne({
                  where: {
                    pageId: page.id,
                    queryId: query.id
                  }
                })
              ))
              .then(termRanks => {
                return termRanks.map((termRank, idx) => ({
                  page: pages[idx],
                  rank: termRank.rank
                }))
              })
              .catch(next);
            })
      )
      .then(unsortedPages => {
        return unsortedPages
          .sort((a, b) => b.rank - a.rank)
          .map(el => el.page);
      })
      .then(sortedPages => {
        res.status(200).json(sortedPages);
      })
      .catch(next);
  } else{
    next(new Error('terms not set in the url query'))
  }
});

router.put('/relevancy', (req, res, next) => {
  Query.findOrCreateQuery(req.query.terms.split(' '))
    .then(([query]) => {
      return query.updateRelevance(req.body);
    })
    .then(() => res.status(201).send('Updated Successfully'))
    .catch(next);
});
