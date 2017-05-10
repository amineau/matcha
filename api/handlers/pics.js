'use strict';

const DbParser	 	= require("../models/parser/db")
const PicValidator  = require("../models/parser/pic")
const PicQuery      = require("../models/shema/pic")
const _             = require('lodash')

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
  const isHead = (data) => {
    if (data.head)
      return Query.Clear({id})
        .then(() => Promise.resolve(data))
        .catch(err => Promise.reject(err))
    data.head = false
    return Promise.resolve(data)
  }

  Promise.all([
    validate.pic.Parse([
      {name: 'base64'},
      {name: 'head', noReq: true}
    ]),
    Query.Count({id})
      .then(Parser.GetData)
  ])
    .then(data => {
      if (data[1][0].count >= 5) {
        return Promise.reject({error: "Vous ne pouvez pas charger plus de 5 photos"})
      } else if (data[1][0].count === 0) {
        data[0].head = true
      }
      return Promise.resolve(data[0])
    })
    .then(data => isHead(data))
    .then(data => Query.Add(_.merge(data, {id})))
    .then(Parser.GetTrue)
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
    const userId  = req.decoded.id

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

    Query.Delete({picId, userId})
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError)
}
