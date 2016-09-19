'use strict';

const ParserDb	 	= require("../models/dbparser");
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
  const id = req.session.userId;
  const search 	= req.body.tag;
  const query 	=
      `MATCH(t: Tag), (u: User)
      WHERE id(u) = {id}
      AND t.name CONTAINS {search}
      AND NOT (u)-[:LIKED]->(t)
      RETURN t.name;`;
  const params 	= {
    id: id,
    search: search
  };

  reqDatabase(query, params, parser.getDebug, res);
};

exports.add = (req, res) => {

  /*  In Promise in each function   */
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
      MERGE (t:Tag {name: {tag}})
      CREATE UNIQUE (u)-[:LIKED]->(t)
      RETURN t;`;
  const params 	= {
    id : id,
    tag: tag
  };
  console.log(tag);

  reqDatabase(query, params, parser.getDebug, res);
};

