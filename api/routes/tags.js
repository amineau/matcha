/*jshint node:true */

'use strict'

const tag = require('../handlers/tags')

module.exports = (app) => {

  app.post('/tags/:tag', tag.add)
  app.get('/tags/:id', tag.get)
  app.get('/tags/search/:tag', tag.search)
  app.delete('/tags', tag.remove)

}
