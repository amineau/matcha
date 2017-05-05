'use strict';

const ChatValidator  = require("../models/parser/chat")
const _              = require('lodash')

exports.get = (req, res) => {
  const senderId = req.decoded.id
  const recipientId = req.params.id
  const query = req.app.get('query')

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

  query.FindComments([senderId, recipientId])
    .then(showSuccess)
    .catch(showError)
}

exports.add = (req, res) => {
  const validate = {chat: new ChatValidator(req.body)}
  const senderId = req.decoded.id
  const recipientId = req.params.id
  const query = req.app.get('query')

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

  validate.chat.Parse([{name: 'comment'}])
    .then(comment => query.AddComment([senderId, recipientId], comment))
    .then(showSuccess)
    .catch(showError)
}
