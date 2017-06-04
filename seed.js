
const db = require('./server/db/db');
const Page = require('./server/db/models').Page;
const Promise = require('bluebird');

const data = {
  page: [
    { url: 'sites/halo_1.html', image: 'images/halo_1.jpg', terms: ['halo', 'game', 'one'], term_rank: .50, page_rank: .60, },
    { url: 'sites/halos_fruit.html', image: 'images/halos_fruit.png', terms: ['halo', 'fruit', 'oranges'], term_rank: .50, page_rank: .60, },
    { url: 'sites/angel-halo.html', image: 'images/angel-halo.jpg', terms: ['halo', 'angel'], term_rank: .50, page_rank: .60, },
    { url: 'sites/beyonce-halo.html', image: 'images/beyonce-halo.jpg', terms: ['halo', 'beyonce', 'music'], term_rank: .50, page_rank: .60, },
    { url: 'sites/halo-deadpool.html', image: 'images/halo-deadpool.jpg', terms: ['halo', 'deadpool', 'fan'], term_rank: .50, page_rank: .60, },
    { url: 'sites/halo-5.html', image: 'images/halo-5.jpg', terms: ['halo', 'game', 'five'], term_rank: .50, page_rank: .60, },
  ]
};


db.sync({force: true})
.then(function () {
  console.log("Dropped old data, now inserting seed data");
  return Promise.map(Object.keys(data), name => {
    return Promise.map(data[name], item => {
      return db.model(name).create(item);
    });
  });
})
.then(() => {
  console.log("Finished inserting seed data");
})
.catch(console.error.bind(console));
