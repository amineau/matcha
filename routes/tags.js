/*jshint node:true */

"use strict";

const tag = require('../handlers/tags');

module.exports = (app) => {

  app.post('/tags/search', tag.search);
  app.post('/tags/add', tag.add);

};