
const db = require('./server/db/db');
const Page = require('./server/db/models').Page;
const Promise = require('bluebird');

const data = {
  page: [
    { url: 'sites/halo_1.html', image: 'images/halo_1.jpg', terms: ['halo', 'game']},
    { url: 'sites/halos_fruit.html', image: 'images/halos_fruit.png', terms: ['halo', 'fruit', 'oranges']},
    { url: 'sites/angel-halo.html', image: 'images/angel-halo.jpg', terms: ['halo', 'angel']},
    { url: 'sites/beyonce-halo.html', image: 'images/beyonce-halo.jpg', terms: ['halo', 'beyonce', 'music']},
    { url: 'sites/halo-deadpool.html', image: 'images/halo-deadpool.jpg', terms: ['halo', 'game']},
    { url: 'sites/halo-5.html', image: 'images/halo-5.jpg', terms: ['halo', 'game']},
    { url: 'sites/mangosteen.html', image: 'images/halo-5.jpg', terms: ['fruit', 'mangosteen']},
    { url: 'sites/durian.html', image: 'images/halo-5.jpg', terms: ['fruit', 'durian']},
    { url: 'sites/apple.html', image: 'images/halo-5.jpg', terms: ['fruit', 'apple']},
    { url: 'sites/halo-5-official.html', image: 'images/halo-5-official.jpg', terms: ['halo', 'game']},
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
