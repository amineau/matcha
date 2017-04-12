'use strict'

const DbParser	 	        = require("../models/parser/db")
const NotifQuery          = require("../models/shema/notif")
const Auth                = require("../models/auth")
const _                   = require('lodash')

const db		  = require("../db")

const Parser  = new DbParser()
const Query   = new NotifQuery()


exports.notif = (req, res) => {
  const auth = new Auth (req.session)
  const userId = req.session.userId

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
    .then(() => Query.ReadNotif({userId}))
    .then(Parser.GetData)
    .then((data) => {
      return Query.NotifToFalse({userId})
        .then(() => Promise.resolve(data))
        .catch(err => Promise.reject(err))
    })
    .then(showSuccess)
    .catch(showError)
}
