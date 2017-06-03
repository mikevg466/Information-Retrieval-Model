'use strict';

const _ = require('lodash');

const db = require('../db');
const DataTypes = db.Sequelize;

module.exports = db.define('song', {
  name: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false,
    set: function (val) {
      this.setDataValue('name', val.trim());
    }
  },
  genre: {
    type: DataTypes.STRING,
  },
  /* NOTE: `url` is internal to the server, and is hidden from the client. */
  url: {
    type: DataTypes.STRING(1e4), // eslint-disable-line new-cap
    allowNull: false
  },
}, {
  defaultScope: {
    attributes: {
      include: ['albumId'], // excluded by default, need for `song.getAlbum()`
    },
  },
  scopes: {
    populated: () => ({ // function form lets us use to-be-defined models
      include: [{
        model: db.model('artist')
      }]
    })
  },
  instanceMethods: {
    toJSON: function () { // overriding toJSON to prevent url from leaking to client
      // see https://github.com/sequelize/sequelize/issues/1462
      return _.omit(this.get(), ['url']);
    }
  }
});
