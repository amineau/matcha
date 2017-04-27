'use strict';

const ChatValidator  = require("../models/parser/chat")
const Auth           = require("../models/auth")
const _              = require('lodash')

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

exports.add = (req, res) => {
  const validate = {pic: new ChatValidator(req.body)}
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
