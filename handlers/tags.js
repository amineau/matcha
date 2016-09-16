/*jshint node:true */

'use strict';

const ParserDb	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const parser = new ParserDb();

function reqDatabase(query, params, parser, res) {
  const showSucces = (data) => {
    console.log(data);
    res.json(data);
  };
  const showError = (err) => {
    res.json(err);
  };

  return db.doDatabaseOperation(query, params, parser)
      .then(showSucces)
      .catch(showError);
}

exports.search = (req, res) => {
  const search 	= req.body.tag;
  const query 	=
      `MATCH(tag: Tag)
      WHERE tag.name =~ {search}
      RETURN *;`;
  const params 	= {'name': '.*' + search + '.*'};

  reqDatabase(query, params, parser.getAll, res);
};

