const db = require('../server/db/db');
const Page = require('../server/db/models').Page;
const Query = require('../server/db/models').Query;
const TermRank = require('../server/db/models').TermRank;
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
        return Promise.all([
          Page.create({
            url: 'http://www.test/url.com',
            image: 'http://www.test/image.com',
            terms: ['one', 'two'],
            term_rank: .50,
            page_rank: .25,
          }),
          Query.create({
            name: 'game halo',
            terms: ['halo', 'game']
          })
        ])
      });
  });

  // erase all tasks after each spec
  after(() => {
    return db.sync({force: true});
  });

  describe('Page', () => {
    describe('fields', () => {
      it('has a url fieldhalo that is a String', () => {
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
    describe('class methods', () => {
      const classPageOne = {
        url: 'http://www.testClass1/url.com',
        image: 'http://www.testClass1/image.com',
        terms: ['class', 'Yep'],
        page_rank: .25,
      };
      const classPageTwo = {
        url: 'http://www.testClass2/url.com',
        image: 'http://www.testClass2/image.com',
        terms: ['class', 'Nope'],
        page_rank: .25,
      };
      const classPageThree = {
        url: 'http://www.testClass3/url.com',
        image: 'http://www.testClass3/image.com',
        terms: ['class', 'Yep'],
        page_rank: .25,
      };
      const classPageFour = {
        url: 'http://www.testClass4/url.com',
        image: 'http://www.testClass4/image.com',
        terms: ['I', 'have', 'noClass'],
        page_rank: .25,
      };
      before(() => {
        return Page.create(classPageOne)
          .then(() => Page.create(classPageTwo))
          .then(() => Page.create(classPageThree))
          .then(() => Page.create(classPageFour))
      });
      it('findWithTerms class method finds all pages that have specified terms associated with it', () => {
        return Page.findWithTerms('class Yep')
          .then(pages => {
            const pageArr = [
              Page.build(classPageOne),
              Page.build(classPageThree)
            ];
            expect(pages).to.be.an('array');
            expect(pages).to.have.a.lengthOf(2);
            expect(pages.map(page => page.url)).to.deep.equal(pageArr.map(page => page.url));
          });
      });
      it('findAnyTerm class method finds all pages that match any of the given terms', () => {
        return Page.findAnyTerm('Yep noClass')
          .then(pages => {
            const pageArr = [
              Page.build(classPageOne),
              Page.build(classPageThree),
              Page.build(classPageFour)
            ];
            expect(pages).to.be.an('array');
            expect(pages).to.have.a.lengthOf(3);
            expect(pages.map(page => page.url)).to.deep.equal(pageArr.map(page => page.url));
          })
      })
    });
    describe('instance methods', () => {
      it('incrementPageRank instance method updates page_rank field by indicated amount', () => {
        Page.findOne({where: {url: 'http://www.test/url.com'}})
          .then(page => {
            expect(page.page_rank).to.equal(.25);
            return page.incrementPageRank(.35);
          })
          .then(page => {
            expect(page.page_rank).to.equal(.60);
          })
      })
    });
  });

  describe('Query', () => {
    describe('definition', () => {
      it('has a name attribute that is a String', () => {
        return Query.findOne()
          .then(query => {
            expect(query.name).to.be.a('string');
          });
      });
      it('has a term attribute that is an array of Strings', () => {
        return Query.findOne()
          .then(query => {
            expect(query.terms).to.be.an('array');
          });
      });
    });
    describe('class methods', () => {
      beforeEach(() => {
        return db.sync({force: true});
      });
      it('has a class method that creates an instance based on array of terms', () => {
        expect(Query.findOrCreateQuery).to.be.a('function');
        return Query.findOrCreateQuery(['test', 'this'])
          .then(([query]) => {
            expect(query.name).to.equal('test this');
            expect(query.terms).to.deep.equal(['test', 'this']);
          });
      });
      it('fills in name correctly based on array of terms', () => {
        return Promise.all([
          Query.findOrCreateQuery(['test', 'first']),
          Query.findOrCreateQuery(['b', 'c', 'test', 'a']),
          Query.findOrCreateQuery(['d', 'e', 'f', 'test'])
        ])
          .then(values => {
            expect(values[0][0].name).to.equal('first test');
            expect(values[1][0].name).to.equal('a b c test');
            expect(values[2][0].name).to.equal('d e f test');
          });
      });
      it('does not create a new row if another instance contains same terms', () => {
        return Query.findOrCreateQuery(['b', 'c', 'a', 'test'])
          .then(([query]) => {
            expect(query.name).to.equal('a b c test');
            return Query.findAll();
          })
          .then(queryArr => {
            expect(queryArr).to.have.a.lengthOf(1);
            return Query.findOrCreateQuery(['a', 'b', 'c', 'test']);
          })
          .then(([query]) => {
            expect(query.name).to.equal('a b c test');
            return Query.findAll();
          })
          .then(queryArr => {
            expect(queryArr).to.have.a.lengthOf(1);
          })
      });
    });
  });

  describe('TermRank', () => {
    beforeEach(() => {
      return db.sync({force: true})
        .then( () => Promise.all([
          Page.create({
            url: 'http://www.testRank/url.com',
            image: 'http://www.testRank/image.com',
            terms: ['test', 'rank', 'one', 'two', 'three'],
          }),
          Query.findOrCreateQuery(['test', 'rank', 'two'])
        ]))
        .then()
        .then(([page, [query]]) => {
          return query.updateRanks();
        });
    });
    describe('definition', () => {
      it('has a foreign key for Page', () => {
        return TermRank.findOne()
          .then(term_rank => {
            expect(term_rank.pageId).to.be.a('number');
          });
      });
      it('has a foreign key for Query', () => {
        return TermRank.findOne()
          .then(term_rank => {
            expect(term_rank.queryId).to.be.a('number');
          })
      });
      it('has a rank attribute that is a Double', () => {
        return TermRank.findOne()
          .then(term_rank => {
            expect(term_rank.rank).to.be.a('number');
          })
      });
    });
    describe('methods to handle rank value', () => {
      it('has a instance method that sets rank based on a query', () => {
        return Query.findOne()
          .then(query => {
            return TermRank.findOne()
              .then(termRank => {
                expect(termRank.setRank).to.be.a('function');
                return termRank.setRank(query);
              })
              .then(termRank => {
                expect(termRank.rank).to.equal(3);
                return TermRank.findOne();
              })
              .then(termRank => {
                expect(termRank.rank).to.equal(3);
              });
          });
      });
      it('has a class method that sets rank for all instances related to a query', () => {
        return Query.findOne()
          .then(query => {
            expect(TermRank.setRankFromQuery).to.be.a('function');
            return TermRank.setRankFromQuery(query);
          })
          .then(() => TermRank.findOne())
          .then(termRank => {
            expect(termRank.rank).to.equal(3);
          })
      });
    });
    describe('methods to handle machine learning of rank value', () => {
      beforeEach(() => {
        return Promise.all([
          Page.create({
            url: 'http://www.testRank2/url.com',
            image: 'http://www.testRank2/image.com',
            terms: ['test', 'rank', 'four', 'five', 'six'],
          }),
          Page.create({
            url: 'http://www.testRank3/url.com',
            image: 'http://www.testRank3/image.com',
            terms: ['test', 'rank'],
          }),
          Page.create({
            url: 'http://www.testRank4/url.com',
            image: 'http://www.testRank4/image.com',
            terms: ['test', 'rank', 'one', 'two', 'three'],
          }),
          Page.create({
            url: 'http://www.testRank5/url.com',
            image: 'http://www.testRank5/image.com',
            terms: ['apples', 'mangos', 'fruits'],
          })
        ]);
      });
      it('has a TermRank class method that increases rank based on a query, page, and rankIncrease input', () => {
        return Promise.all([
          Page.findOne(),
          Query.findOne()
        ])
          .then(([page, query]) => {
            expect(page.url).to.equal('http://www.testRank/url.com');
            return TermRank.setRelevance(query, page, 2.5)
          })
          .then(termRank => {
            expect(termRank.rank).to.equal(5.5);
          })
      });
      it('has a query instance method that increases the rank of all pages for each term as the input page', () => {
        let curQuery, curPage;
        return Query.findOne()
          .then(query => {
            curQuery = query;
            return query.updateRanks();
          })
          .then(() => Page.findAll())
          .then(pageList => {
            expect(pageList[0].url).to.equal('http://www.testRank/url.com');
            curPage = pageList[0];
            return TermRank.findAll();
          })
          .then(termRankList => {
            const expectedValList = [0, 3, 2, 2, 3];
            expect(termRankList[0].rank).to.equal(expectedValList[termRankList[0].pageId]);
            expect(termRankList[1].rank).to.equal(expectedValList[termRankList[1].pageId]);
            expect(termRankList[2].rank).to.equal(expectedValList[termRankList[2].pageId]);
            expect(termRankList[3].rank).to.equal(expectedValList[termRankList[3].pageId]);
            return curQuery.updateRelevance(curPage);
          })
          .then(() => TermRank.findAll())
          .then(termRankList => {
            const expectedValList = [0, 4, 2.40, 2.40, 4];
            expect(termRankList[0].pageId).to.equal(curPage.id);
            expect(termRankList[0].rank).to.equal(expectedValList[termRankList[0].pageId]);
            expect(termRankList[1].rank).to.equal(expectedValList[termRankList[1].pageId]);
            expect(termRankList[2].rank).to.equal(expectedValList[termRankList[2].pageId]);
            expect(termRankList[3].rank).to.equal(expectedValList[termRankList[3].pageId]);
          })

          // use Number(Math.round(1.005+'e2')+'e-2');
      });
    });
  });
});
