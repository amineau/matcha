'use strict'

const DbParser	 	  = require("../models/parser/db")
const ChatValidator  = require("../models/parser/chat")
const ConnexionQuery     = require("../models/shema/connexion")
const _              = require('lodash')

const Parser = new DbParser()
const Query  = new ConnexionQuery()

exports.get = (req, res) => {
  const senderId = req.decoded.id
  const recipientId = Number(req.params.id)
  const query = req.app.get('query')

  const showSuccess = (data) => {
    console.log('data', data)
    res.json({
      data,
      success: true
    })
  }
  const showError = (err) => {
    console.log('error',err)
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.ReadChat({userId: senderId, id: recipientId})
    .then(Parser.GetTrue)
    .then(() => query.FindComments([senderId, recipientId]))
    .then(showSuccess)
    .catch(showError)
}

exports.getAll = (req, res) => {
  const id = req.decoded.id
  const query = req.app.get('query')

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

  query.FindMessages(id)
    .then(showSuccess)
    .catch(showError)
}

exports.add = (req, res) => {
  const validate = {chat: new ChatValidator(req.body)}
  const senderId = req.decoded.id
  const recipientId = Number(req.params.id)
  const query = req.app.get('query')
  const io = req.app.get('io')

  const showSuccess = (data) => {
    io.emit('notif', recipientId)
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

  Query.Chat({userId: senderId, id: recipientId})
    .then(Parser.GetTrue)
    .then(() => validate.chat.Parse([{name: 'comment'}]))
    .then(data => {
      io.emit('chat', { senderId, recipientId, comment: data.comment })
      return query.AddComment([senderId, recipientId], data)
    })
    .then(showSuccess)
    .catch(showError)
}
