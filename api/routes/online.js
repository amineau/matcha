'use strict'

const tag = require('../handlers/online')
const restrict = require('../models/restrict')

module.exports = (app) => {

  app.get('/online/:userId', restrict, tag.online)

}
