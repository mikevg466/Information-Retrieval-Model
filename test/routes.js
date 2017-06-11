const db = require('../server/db/db');
const Page = require('../server/db/models').Page;
const Query = require('../server/db/models').Query;
const TermRank = require('../server/db/models').TermRank;
const expect = require('chai').expect;
var supertest = require('supertest');
var agent = supertest.agent(require('../server/app'));

describe('Routes', () => {
  const pageOne = {
    url: 'http://www.test/url.com',
    image: 'http://www.test/image.com',
    terms: ['one', 'two'],
    term_rank: .50,
    page_rank: .60,
  };
  const pageTwo = {
    url: 'http://www.test2/url.com',
    image: 'http://www.test2/image.com',
    terms: ['three', 'two'],
    term_rank: .50,
    page_rank: .60,
  };
  const pageThree = {
    url: 'http://www.test3/url.com',
    image: 'http://www.test3/image.com',
    terms: ['one', 'two'],
    term_rank: .50,
    page_rank: .60,
  };
  const pageFour = {
    url: 'http://www.test4/url.com',
    image: 'http://www.test4/image.com',
    terms: ['three', 'one'],
    term_rank: .50,
    page_rank: .60,
  };
  before(() => {
    return db.sync({force: true})
      .then(() => Page.create(pageOne))
      .then(() => Page.create(pageTwo))
      .then(() => Page.create(pageThree))
      .then(() => Page.create(pageFour))
      .then(() => Query.findOrCreateQuery(['one', 'two']))
      .then(([query]) => query.updateRanks());
  });
  after(() => {
    return db.sync({force:true});
  });
  describe('api/pages', () => {
    describe('root', () => {
      it('GET method returns all pages', done => {
        agent.get('/api/pages/')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(4);
            done();
          });
      });
      it('query string filter returns pages associated with a specfic term', done => {
        agent.get('/api/pages?terms=one')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            const testArr = [
              Page.build(pageOne),
              Page.build(pageThree),
              Page.build(pageFour)
            ];
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(3);
            expect(res.body.map(page => page.url)).to.deep.equal(testArr.map(page => page.url));
            done();
          });
      });
      it('query string filters for multiple terms space separated', done => {
        agent.get('/api/pages?terms=one%20two')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            const testArr = [
              Page.build(pageOne),
              Page.build(pageThree)
            ];
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(2);
            expect(res.body.map(page => page.url)).to.deep.equal(testArr.map(page => page.url));
            done();
          });
      });
    });
    describe('/vectorSearch', () => {
      it('returns only the pages that contain a term', done => {
        agent.get(`/api/pages/vectorSearch?terms=one`)
          .expect(200)
          .end(function (err, res){
            if(err) return done(err);
            const testArr = [
              Page.build(pageOne),
              Page.build(pageThree),
              Page.build(pageFour)
            ];
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(3);
            expect(res.body.map(page => page.url)).to.deep.equal(testArr.map(page => page.url));
            done();
          })
      })
      it('returns all pages that contains any of the query terms', done => {
        agent.get(`/api/pages/vectorSearch?terms=one%20two`)
          .expect(200)
          .end(function (err, res){
            if(err) return done(err);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(4);
            done();
          })
      });
      it('orders the pages based on the relevance to the query', done => {
        agent.get(`/api/pages/vectorSearch?terms=one%20two`)
          .expect(200)
          .end(function (err, res){
            if(err) return done(err)
            const testArr = [
              Page.build(pageOne),
              Page.build(pageThree),
              Page.build(pageTwo),
              Page.build(pageFour)
            ]
            expect(res.body.map(page => page.url)).to.deep.equal(testArr.map(page => page.url));
            done();
          })
      })
    });
    describe('/relevancy/:queryId', () => {
      it('PUT will change the order of all pages related to a query', done => {
        Promise.all([
          Query.findOne(),
          Page.findOne({where: pageFour})
        ])
          .then(([query, page]) => {
            agent.put(`/api/pages/relevancy?terms=one%20two`)
              .send(page)
              .expect(201)
              .end(function(err, res){
                if(err) return done(err);
                const testArr = [
                  null,
                  pageOne,
                  pageTwo,
                  pageThree,
                  pageFour
                ]
                const testRank = [
                  null,
                  2.50,
                  1.50,
                  2.50,
                  2
                ]
                TermRank.findAll({
                  where: {
                    queryId: query.id
                  }
                })
                  .then(termRankList => {
                    termRankList.sort((a, b) => b.rank - a.rank);
                    expect(termRankList[0].pageId).to.equal(1);
                    expect(termRankList[1].pageId).to.equal(3);
                    expect(termRankList[2].pageId).to.equal(4);
                    expect(termRankList[3].pageId).to.equal(2);

                    expect(termRankList[0].rank).to.equal(testRank[termRankList[0].pageId]);
                    expect(termRankList[1].rank).to.equal(testRank[termRankList[1].pageId]);
                    expect(termRankList[2].rank).to.equal(testRank[termRankList[2].pageId]);
                    expect(termRankList[3].rank).to.equal(testRank[termRankList[3].pageId]);
                    done();
                  })
              })
          })
      });
      it('PUT changes all pages relevancy based on sent QueryId and Page', done => {
        Promise.all([
          Query.findOne(),
          Page.findOne({where: pageFour})
        ])
          .then(([query, page]) => {
            agent.put(`/api/pages/relevancy?terms=one%20two`)
              .send(page)
              .expect(201)
              .end(function(err, res){
                if(err) return done(err);
                return TermRank.findAll({where: {
                  queryId: query.id
                }})
                  .then(termRankList => {
                    const testArr = [
                      0,
                      3,
                      2,
                      3,
                      3
                    ];
                    expect(termRankList[0].rank).to.equal(testArr[termRankList[0].pageId]);
                    expect(termRankList[1].rank).to.equal(testArr[termRankList[1].pageId]);
                    expect(termRankList[2].rank).to.equal(testArr[termRankList[2].pageId]);
                    expect(termRankList[3].rank).to.equal(testArr[termRankList[3].pageId]);
                    done();
                  })
              })
          })
      });
    });
  });
});
