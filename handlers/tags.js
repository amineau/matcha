'use strict';

const ParserDb	 	= require("../models/parser/db");
const TagsValidator = require("../models/parser/tags");
const TagsQuery     = require("../models/shema/tags");
const Auth          = require("../models/auth");

const Parser = new ParserDb();
const Query = new TagsQuery();

exports.search = (req, res) => {
  req.body.id = req.session.userId;
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = () => {
    return validate.ParseTag();
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
  req.body.id = req.session.userId;
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseId = () => {
    return validate.ParseId();
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
      .then(ParseId)
      .then(Query.Get)
      .then(Parser.GetData)
      .then(showSuccess)
      .catch(showError);
};

exports.add = (req, res) => {
  req.body.id = req.session.userId;
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = () => {
    return validate.ParseTag();
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
  req.body.id = req.session.userId;
  const validate = new TagsValidator(req.body);
  const auth = new Auth (req.session);

  const ParseTag = () => {
    return validate.ParseTag();
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