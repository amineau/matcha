'use strict'

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const nconf = req.app.get('nconf')
  const token = req.headers['matcha-token']
  jwt.verify(token, nconf.get('token:secret'), (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        err
      })
    }
    const life = parseInt(decoded.exp - Date.now() / 1000)
    console.log('Token expires in ' + life + ' sec')
    req.decoded = decoded
    next()
  })
}
