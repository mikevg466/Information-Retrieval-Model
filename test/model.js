const db = require('../server/db/db');
const Page = require('../server/db/models/page');
const chai = require('chai');
const chaiProperties = require('chai-properties');
const chaiThings = require('chai-things');
chai.use(chaiProperties);
chai.use(chaiThings);
const expect = chai.expect;

describe('Model', function(){

  //clear the database before all tests
  before(function () {
    return db.sync({force: true})
      .then(() => {
        return Page.create({
          url: 'http://www.test/url.com',
          image: 'http://www.test/image.com',
          term_rank: .50,
          page_rank: .60,
        });
      });
  });

  // erase all tasks after each spec
  after(function(){
    return db.sync({force: true});
  });

  describe('Pages', function(){
    describe('fields', function(){
      it('has a url field that is a String', function(){
        return Page.findOne()
          .then(page => {
            expect(page.url).to.equal('http://www.test/url.com');
          });
      });
      it('has an image field that is a String', function(){
        return Page.findOne()
          .then(page => {
            expect(page.image).to.equal('http://www.test/image.com');
          });
      });
      it('has a term_rank field that is a Double', function(){
        return Page.findOne()
          .then(page => {
            expect(page.term_rank).to.equal(.50);
          });
      });
      it('has a page_rank field that is a Double', function(){
        return Page.findOne()
          .then(page => {
            expect(page.page_rank).to.equal(.60);
          });
      });
    });
    describe('validations', function(){
      it('url is a required field', function(){
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
      it('image is a required field', function(){
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
    describe('getter methods', function(){
      it('has a getter method that returns the final_rank based on term_rank and page_rank', function(){
        return Page.findOne()
          .then(page => {
            expect(page.getFinalRank).to.be.a('number');
          });
      });
      it('final_rank getter returns correct rank based on term_rank and page_rank', function(){
        return Page.findOne()
          .then(page => {
            expect(page.getFinalRank).to.equal(.55);
          });
      });
    });
  });
});
