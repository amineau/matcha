'use strict'

const tag = require('../handlers/tags')
const restrict = require('../models/restrict')

module.exports = (app) => {

  app.post('/tags/:tag', restrict, tag.add)
  app.get('/tags/:id', restrict, tag.get)
  app.get('/tags/search/:tag', restrict, tag.search)
  app.delete('/tags', restrict, tag.remove)

}
