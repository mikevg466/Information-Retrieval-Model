const db = require('../server/db/db');
const Page = require('../server/db/models').Page;
const chai = require('chai');
const chaiProperties = require('chai-properties');
const chaiThings = require('chai-things');
chai.use(chaiProperties);
chai.use(chaiThings);
const expect = chai.expect;

describe('Model', () => {

  //clear the database before all tests
  before( () => {
    return db.sync({force: true})
      .then(() => {
        return Page.create({
          url: 'http://www.test/url.com',
          image: 'http://www.test/image.com',
          terms: ['one', 'two'],
          term_rank: .50,
          page_rank: .60,
        });
      });
  });

  // erase all tasks after each spec
  after(() => {
    return db.sync({force: true});
  });

  describe('Pages', () => {
    describe('fields', () => {
      it('has a url field that is a String', () => {
        return Page.findOne()
          .then(page => {
            expect(page.url).to.equal('http://www.test/url.com');
          });
      });
      it('has an image field that is a String', () => {
        return Page.findOne()
          .then(page => {
            expect(page.image).to.equal('http://www.test/image.com');
          });
      });
      it('has a terms field that is an Array of Strings', () => {
        return Page.findOne()
          .then(page => {
            expect(page.terms).to.be.an('array');
            expect(page.terms[0]).to.be.a('string');
            expect(page.terms).to.have.a.lengthOf(2);
          });
      });
      it('has a term_rank field that is a Double', () => {
        return Page.findOne()
          .then(page => {
            expect(page.term_rank).to.equal(.50);
          });
      });
      it('has a page_rank field that is a Double', () => {
        return Page.findOne()
          .then(page => {
            expect(page.page_rank).to.equal(.60);
          });
      });
    });
    describe('validations', () => {
      it('url is a required field', () => {
        const page = Page.build({
          image: 'http://www.test2/image.com',
        });
        return page.validate()
          .then(err => {
              expect(err).to.be.an('object');
              expect(err.errors).to.contain.a.thing.with.properties({
                  path: 'url',
                  type: 'notNull Violation'
              });
          });
      });
      it('image is a required field', () => {
        const page = Page.build({
          url: 'http://www.test2/url.com',
        });
        return page.validate()
          .then(err => {
              expect(err).to.be.an('object');
              expect(err.errors).to.contain.a.thing.with.properties({
                  path: 'image',
                  type: 'notNull Violation'
              });
          });
      });
    });
    describe('default values', () => {
      let defaultTestPage;
      before(() => {
        return Page.create({
          url: 'http://www.testDefault/url.com',
          image: 'http://www.testDefault/image.com',
        })
          .then(page => {
            defaultTestPage = page;
          });
      });
      it('terms has a default value of an empty array', () => {
        expect(defaultTestPage.terms).to.be.an('array');
        expect(defaultTestPage.terms).to.be.empty;
      });
      it('term_rank has a default value of 0.00', () => {
        expect(defaultTestPage.term_rank).to.equal(0.00);
      });
      it('page_rank has a default value of 0.00', () => {
        expect(defaultTestPage.page_rank).to.equal(0.00);
      });
    })
    describe('getter methods', () => {
      it('has a getter method that returns the final_rank based on term_rank and page_rank', () => {
        return Page.findOne()
          .then(page => {
            expect(page.finalRank).to.be.a('number');
          });
      });
      it('final_rank getter returns correct rank based on term_rank and page_rank', () => {
        return Page.findOne()
          .then(page => {
            expect(page.finalRank).to.equal(.55);
          });
      });
    });
  });
});
