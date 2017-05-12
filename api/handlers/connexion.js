'use strict'

const DbParser	 	        = require("../models/parser/db")
const ConnexionValidator  = require("../models/parser/connexion")
const ConnexionQuery      = require("../models/shema/connexion")
const _                   = require('lodash')

const db		  = require("../db")

const Parser  = new DbParser()
const Query   = new ConnexionQuery()


exports.like = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id
  const mongo = req.app.get('query')
  const io = req.app.get('io')

  const showSuccess = (connected) => {
    io.emit('notif', id)
    res.json({
      connected,
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

  Query.Like({id, userId})
    .then((data) => Promise.all([Parser.GetData(data),Parser.GetTrue(data)]))
    .then(data => data[0][0].connected ? mongo.Create([id, userId]) : false)
    .then(showSuccess)
    .catch(showError)
}

exports.unlike = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id
  const mongo = req.app.get('query')
  const io = req.app.get('io')

  const showSuccess = (deco) => {
    if (deco) io.emit('notif', id)
    res.json({
      connected: false,
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

  Query.Unlike({id, userId})
    .then((data) => Promise.all([Parser.GetData(data),Parser.GetTrue(data)]))
    .then(data => data[0][0].deconnected ? mongo.Delete([id, userId]) : false)
    .then(showSuccess)
    .catch(showError)
}

exports.block = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id

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

  Query.Block({id, userId})
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.unblock = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id

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

  Query.Unblock({id, userId})
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.report = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id
  const validate = {connexion: new ConnexionValidator(req.body)}

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

  validate.connexion.Parse([{name: 'message'}])
    .then((data) => Query.Report(_.merge({id, userId}, data)))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.visite = (req, res) => {
  const id = Number(req.params.id)
  const userId = req.decoded.id
  const io = req.app.get('io')

  const showSuccess = (data) => {
    io.emit('notif', id)
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

  Query.Visite(_.merge({id, userId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.likedBy = (req, res) => {
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

  Query.LikedBy({id})
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}

exports.liked = (req, res) => {
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

  Query.Liked({id})
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}

exports.blocked = (req, res) => {
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

  Query.Blocked({id})
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}
