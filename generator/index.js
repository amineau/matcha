'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)

let generator = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json')
  })
  .forEach(function (file) {
    generator[file.slice(0,-5).toString()] = require(path.join(__dirname, file))
  })

module.exports = generator
