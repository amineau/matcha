'use strict';

const DbParser	 	= require("../models/parser/db")
const PicValidator  = require("../models/parser/pic")
const PicQuery      = require("../models/shema/pic")
const Auth          = require("../models/auth")
const _             = require('lodash')

const db			= require("../db")

const Parser = new DbParser()
const Query  = new PicQuery()

exports.get = (req, res) => {
  const auth    = new Auth (req.session)
  const id  = req.params.id

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.status(err.status || 500).json({
      success: false,
      err: err.error
    })
  }

  auth.CheckNoAuth()
    .then(() => Query.Get({id}))
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}

exports.getProfil = (req, res) => {
  const auth    = new Auth (req.session)
  const id  = req.params.id

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.status(err.status || 500).json({
      success: false,
      err: err.error
    })
  }

  auth.CheckNoAuth()
    .then(() => Query.GetProfil({id}))
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}

exports.add = (req, res) => {
  const validate = {pic: new PicValidator(req.body)}
  const auth = new Auth (req.session)
  const id = req.session.userId

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    console.log(err)
    res.status(err.status || 500).json({
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

  auth.CheckNoAuth()
    .then(() => {
      return Promise.all([
        validate.pic.Parse([
          {name: 'pic'},
          {name: 'head', noReq: true}
        ]),
        Query.Count({id})
          .then(Parser.GetData)
      ])
    })
    .then(data => {
      if (data[1][0].count >= 5) {
        return Promise.reject({
          status: 403,
          error: "Vous ne pouvez pas charger plus de 5 photos"
        })
      } else if (data[1][0].count === 0) {
        data[0].head = true
      }
      return Promise.resolve(data[0])
    })
    .then(data => isHead(data))
    .then(data => Query.Add(_.merge(data, {id})))
    .then(Parser.GetDebug)
    .then(showSuccess)
    .catch(showError)
}

exports.profile = (req, res) => {
  const auth = new Auth (req.session)
  const userId  = req.session.userId
  const picId   = Number(req.params.id)

  const showSuccess = (data) => {
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    res.status(err.status || 500).json({
      success: false,
      err: err.error
    })
  }

  auth.CheckNoAuth()
    .then(() => Query.Profile({userId, picId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.delete = (req, res) => {
    const auth    = new Auth (req.session)
    const picId   = Number(req.params.id)
    const userId  = req.session.userId

    const showSuccess = (data) => {
      res.json({
        data,
        success: true
      })
    }
    const showError = (err) => {
      res.status(err.status || 500).json({
        success: false,
        err: err.error
      })
    }

    auth.CheckNoAuth()
      .then(() => Query.Delete({picId, userId}))
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError)
}
