/*jshint node:true */

'use strict';

const ParserDb	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const parser = new ParserDb();

function reqDatabase(query, params, parser, res) {
  const showSucces = (data) => {
    // console.log(data);
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
      WHERE tag.name CONTAINS {search}
      RETURN *;`;
  const params 	= {'search': '(?i)' + search};

  reqDatabase(query, params, parser.getDebug, res);
};

exports.add = (req, res) => {
  const id = req.session.userId;
  if (!id) {
    res.json({
      success: false,
      err: "Opération impossible, vous n'êtes pas connecté."
    });
  }
  const tag 	= req.body.tag;
  const query 	=
      `MATCH (u: User)
      WHERE id(u) = {id}
      MERGE (u)-[:LIKED]->(t:Tag {name: {tag}})
      RETURN t;`;
  const params 	= {
    'id' : id,
    'tag': tag
  };
  console.log(tag);

  reqDatabase(query, params, parser.getDebug, res);
};

