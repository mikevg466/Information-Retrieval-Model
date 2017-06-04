const db = require('../server/db/db');
const Page = require('../server/db/models').Page;
const expect = require('chai').expect;
var supertest = require('supertest');
var agent = supertest.agent(require('../server/app'));

describe('Routes', () => {
  before(() => {
    return db.sync({force: true});
  });
  describe('api/pages', () => {
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
      return Page.create(pageOne)
        .then(() => {
          return Page.create(pageTwo);
        })
        .then(() => {
          return Page.create(pageThree);
        })
        .then(() => {
          return Page.create(pageFour);
        });
    });
    describe('root', (done) => {
      it('GET method returns all pages', () => {
        agent.get('http://localhost:1337/api/pages/')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(4);
            done();
          });
      });
      it('query string filter returns pages associated with a specfic term', (done) => {
        agent.get('http://localhost:1337/api/pages?terms=one')
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
            expect(res.body).to.deep.equal(testArr);
            done();
          });
      });
      it('query string filters for multiple terms space separated', (done) => {
        agent.get('http://localhost:1337/api/pages?terms=one%20two')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            const testArr = [
              Page.build(pageOne),
              Page.build(pageThree)
            ];
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.a.lengthOf(2);
            expect(res.body).to.deep.equal(testArr);
            done();
          });
      })
    });
  });
});
