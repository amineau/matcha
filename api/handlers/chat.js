'use strict';

const ChatValidator  = require("../models/parser/chat")
const _              = require('lodash')

exports.get = (req, res) => {
  const senderId = req.decoded.id
  const recipientId = Number(req.params.id)
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

  query.FindComments([senderId, recipientId])
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


  validate.chat.Parse([{name: 'comment'}])
    .then(data => {
      console.log('socket emit de la merdasse n1')
      io.emit('chat', { senderId, recipientId, comment: data.comment })
      console.log('socket emit de la merdasse')
      return query.AddComment([senderId, recipientId], data)
    })
    .then(showSuccess)
    .catch(showError)
}
