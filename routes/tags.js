/*jshint node:true */

"use strict";

const tag = require('../handlers/tags');

module.exports = (app) => {

  app.get('/tags', tag.get);
  app.post('/tags', tag.search);
  app.put('/tags', tag.add);
  app.delete('/tags', tag.remove);

};