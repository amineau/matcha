'use strict';

const DbParser	 	= require("../models/parser/db")
const PicValidator  = require("../models/parser/pic")
const PicQuery      = require("../models/shema/pic")
const _             = require('lodash')
const fs            = require('fs')
const path          = require('path')
const uuid          = require('node-uuid')

const db			= require("../db")

const Parser = new DbParser()
const Query  = new PicQuery()

exports.get = (req, res) => {
  const id  = req.params.id

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.Get({id})
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}

exports.getProfil = (req, res) => {
  const id  = req.params.id

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.GetProfil({id})
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}

exports.add = (req, res) => {
  const validate = {pic: new PicValidator(req.body)}
  const id = req.decoded.id

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    console.log(err)
    res.json({
      success: false,
      err: err.error
    })
  }
  validate.pic.Parse([{name: 'base64'}])
    .then(data => {
      return new Promise((resolve, reject) => {
        const pathname = path.join(__dirname, '../data/profile', id.toString())
        const filename = uuid.v4() + '.png'
        if (!fs.existsSync(pathname)) {
          fs.mkdirSync(pathname)
        }
        const base64Data = data.base64.replace(/^data:image\/png;base64,/, "")
        var decodedImage = new Buffer(base64Data, 'base64')
        fs.writeFile(path.join(pathname, filename), decodedImage, err => {
          if (err) return reject({error: err})
        })
        resolve({path: path.join(pathname, filename)})
      })
    })
    .then(data => Query.Add(_.merge(data, {id})))
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}

exports.profile = (req, res) => {
  const userId  = req.decoded.id
  const picId   = Number(req.params.id)

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.Profile({userId, picId})
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.delete = (req, res) => {
    const picId   = Number(req.params.id)
    const id  = req.decoded.id

    const showSuccess = (data) => {
      res.json({
        data,
        success: true
      })
    }
    const showError = (err) => {
      console.log(err)
      res.json({
        success: false,
        err: err.error
      })
    }

    Query.Delete({picId, id})
      .then(Parser.GetData)
      .then(data => {
        return new Promise((resolve, reject) => {
          const path = data[0].photoPath
          fs.unlink(path, err => {
            if (err) return reject({error: err})
            const pathname = path.slice(0, path.lastIndexOf('/'))
            fs.readdir(pathname, (err, files) => {
              if (err) return reject({error: err})
              if (!files.length) {
                fs.rmdir(pathname, err => {
                  if (err) return reject({error: err})
                })
              }
            })
          })
          resolve(data)
        })
      })
      .then(showSuccess)
      .catch(showError)
}
