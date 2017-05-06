'use strict';

const DbParser	 	= require("../models/parser/db")
const TagsValidator = require("../models/parser/tags")
const TagsQuery     = require("../models/shema/tags")
const _             = require('lodash')

const Parser = new DbParser()
const Query = new TagsQuery()

exports.search = (req, res) => {
  const validate = {tags: new TagsValidator(req.params)}
  const id = req.decoded.id

  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    console.log(err)
    res.json({
      success: false,
      err: err.error
    })
  }

  validate.tags.Parse([{name: 'tag'}])
      .then((data) => Query.Search(_.merge(data, {id})))
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError)
}

exports.get = (req, res) => {
  const id = req.params.id
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.Get({id})
      .then(Parser.GetList)
      .then(showSuccess)
      .catch(showError);
}

exports.getAll = (req, res) => {
  const showSuccess = (data) => {
    res.json({
      success: true,
      data
    })
  }
  const showError = (err) => {
    console.log(err)
    res.json({
      success: false,
      err: err.error
    })
  }

  Query.GetAll({})
      .then(Parser.GetList)
      .then(showSuccess)
      .catch(showError);
}

exports.add = (req, res) => {
  const validate = {tags: new TagsValidator(req.params)}
  const id = req.decoded.id

  const showSuccess = () => {
    res.json({
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
  validate.tags.Parse([{name: 'tag'}])
      .then((data) => Query.Add(_.merge(data, {id})))
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError);
}

exports.remove = (req, res) => {
  const validate = {tags: new TagsValidator(req.body)}

  const showSuccess = () => {
    res.json({
      success: true
    })
  }
  const showError = (err) => {
    res.json({
      success: false,
      err: err.error
    })
  }
  validate.tags.Parse([{name: 'tag'}])
      .then(Query.Remove)
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError)
}
