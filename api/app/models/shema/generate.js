"use strict";

const db = require("../../db")
const _  = require('lodash')

module.exports = class GenerateQuery {

  DeleteAll() {
    return new Promise((resolve, reject) => {
      const query =
      `MATCH (n) DETACH DELETE n`

      db.doDatabaseOperation(query, {})
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }

  Generate(data) {
    return new Promise((resolve, reject) => {
      const query =
        `UNWIND {user} AS map
        CREATE (u:User)
        SET u = map
        RETURN id(u) AS id, u.sex AS sex`

      db.doDatabaseOperation(query, data)
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }
}
