'use strict'

const DbParser	 	        = require("../models/parser/db")
const NotifQuery          = require("../models/shema/notif")
const _                   = require('lodash')
const db		              = require("../db")

const Parser  = new DbParser()
const Query   = new NotifQuery()


exports.toFalse = (req, res) => {
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

  Query.NotifToFalse({userId})
    .then(Parser.GetTrue)
    .then(showSuccess)
    .catch(showError)
}

exports.notif = (req, res) => {
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

  Query.ReadNotif({userId})
    .then(Parser.GetData)
    .then(showSuccess)
    .catch(showError)
}
