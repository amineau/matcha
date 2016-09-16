/*jshint node:true */

"use strict";

const tags = require('../handlers/tags');

module.exports = (app) => {

  app.get('/tags/search', tags.search);

};