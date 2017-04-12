'use strict'

const DbParser	 	        = require("../models/parser/db")
const ConnexionValidator  = require("../models/parser/connexion")
const ConnexionQuery      = require("../models/shema/connexion")
const Auth                = require("../models/auth")
const _                   = require('lodash')

const db		  = require("../db")

const Parser  = new DbParser()
const Query   = new ConnexionQuery()


exports.like = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId

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
    .then(() => Query.Like({id, userId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.unlike = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId

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
    .then(() => Query.Unlike({id, userId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.block = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId

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
    .then(() => Query.Block({id, userId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.unblock = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId

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
    .then(() => Query.Unblock({id, userId}))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.report = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId
  const validate = {connexion: new ConnexionValidator(req.body)}

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
    .then(() => validate.connexion.Parse([{name: 'message'}]))
    .then((data) => Query.Report(_.merge({id, userId}, data)))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.visite = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const userId = req.session.userId

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
    .then(() => Query.Visite(_.merge({id, userId})))
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.likedBy = (req, res) => {
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
    .then(() => Query.LikedBy({id}))
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}

exports.liked = (req, res) => {
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
    .then(() => Query.Liked({id}))
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}

exports.blocked = (req, res) => {
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
    .then(() => Query.Blocked({id}))
    .then(Parser.GetIds)
    .then(showSuccess)
    .catch(showError)
}
