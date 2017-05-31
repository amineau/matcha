'use strict'

const jwt = require('jsonwebtoken')
const UserQuery = require("../models/shema/user")

const Query  = new UserQuery()

module.exports = (req, res, next) => {
  const nconf = req.app.get('nconf')
  const token = req.headers['matcha-token']
  jwt.verify(token, nconf.get('token:secret'), (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        err
      })
    }
    Query.Connection({id: decoded.id})
    const life = parseInt(decoded.exp - Date.now() / 1000)
    //console.log('Token expires in ' + life + ' sec')
    req.decoded = decoded
    next()
  })
}
