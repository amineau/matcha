'use strict';

const DbParser	 	= require("../models/parser/db");
const TagsValidator = require("../models/parser/tags");
const TagsQuery     = require("../models/shema/tags");
const Auth          = require("../models/auth");

const Parser = new DbParser();
const Query = new TagsQuery();

exports.search = (req, res) => {
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = (data) => {
    return validate.ParseTag(data);
  };

  const showSuccess = (data) => {
    res.json(data);
  };
  const showError = (err) => {
    res.status(err.status).json({
      success: false,
      err: err.error
    });
  };

  auth.CheckNoAuth()
      .then(ParseTag)
      .then(Query.Search)
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
};

exports.get = (req, res) => {
  const auth = new Auth (req.session);

  const showSuccess = (data) => {
    res.json(data);
  };
  const showError = (err) => {
    res.status(err.status).json({
      success: false,
      err: err.error
    });
  };

  auth.CheckNoAuth()
      .then(Query.Get)
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
};

exports.add = (req, res) => {
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = (data) => {
    return validate.ParseTag(data);
  };

  const showSuccess = () => {
    res.json({
      success: true
    });
  };
  const showError = (err) => {
    res.status(err.status).json({
      success: false,
      err: err.error
    });
  };
  auth.CheckNoAuth()
      .then(ParseTag)
      .then(Query.Add)
      .then(Parser.GetTrue)
      .then(showSuccess)
      .catch(showError);
};

exports.remove = (req, res) => {
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = (data) => {
    return validate.ParseTag(data);
  };

  const showSuccess = () => {
    res.json({
      success: true
    });
  };
  const showError = (err) => {
    res.status(err.status).json({
      success: false,
      err: err.error
    });
  };
  auth.CheckNoAuth()
      .then(ParseTag)
      .then(Query.Remove)
      .then(Parser.GetTrue)
      .then(Query.Delete)
      .then(showSuccess)
      .catch(showError);
};