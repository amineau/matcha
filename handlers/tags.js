'use strict';

const DbParser	 	= require("../models/parser/db")
const TagsValidator = require("../models/parser/tags")
const TagsQuery     = require("../models/shema/tags")
const Auth          = require("../models/auth")
const _             = require('lodash')

const Parser = new DbParser()
const Query = new TagsQuery()

exports.search = (req, res) => {
  const validate = {tags: new TagsValidator(req.params)}
  const auth = new Auth (req.session)
  const id = req.session.userId

  const showSuccess = (data) => {
    res.json({
      success: true,
      data
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
      .then(() => validate.tags.Parse([{name: 'tag'}]))
      .then((data) => Query.Search(_.merge(data, {id})))
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError)
}

exports.get = (req, res) => {
  const auth = new Auth (req.session)
  const id = req.params.id
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
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
      .catch(showError);
}

exports.add = (req, res) => {
  const validate = {tags: new TagsValidator(req.body)}
  const auth = new Auth (req.session)
  const id = req.session.userId

  const showSuccess = () => {
    res.json({
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
      .then(() => validate.tags.Parse([{name: 'tag'}]))
      .then((data) => Query.Add(_.merge(data, {id})))
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError);
}

exports.remove = (req, res) => {
  const validate = {tags: new TagsValidator(req.body)}
  const auth = new Auth (req.session)

  const showSuccess = () => {
    res.json({
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
      .then(() => validate.tags.Parse([{name: 'tag'}]))
      .then(Query.Remove)
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError)
}
