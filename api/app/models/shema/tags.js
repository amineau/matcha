'use strict'

const db = require("../../db");

module.exports = class TagsQuery {

  Search(data) {
    return new Promise((resolve, reject) => {
      const query =
        `MATCH(t: Tag), (u: User)
        WHERE id(u) = {id}
        AND lower(t.name) CONTAINS lower({tag})
        AND NOT (u)-[:LIKED]->(t)
        RETURN t.name as tag;`

      db.doDatabaseOperation(query, data)
        .then(data => resolve(data))
        .catch((err) => reject(err))
    })
  }

  Get(data) {
    return new Promise((resolve, reject) => {
      const query =
        `MATCH(u: User)-[:LIKED]->(t: Tag)
        WHERE id(u) = {id}
        RETURN t as tag;`

      db.doDatabaseOperation(query, data)
        .then(data => resolve(data))
        .catch((err) => reject(err))
    })
  }

    GetAll(data) {
      return new Promise((resolve, reject) => {
        const query =
          `MATCH (t: Tag)
          RETURN t.name as tag;`

        db.doDatabaseOperation(query, data)
          .then(data => resolve(data))
          .catch((err) => reject(err))
      })
    }

  Add(data) {
    return new Promise((resolve, reject) => {
      const query =
        `MATCH (u: User)
        WHERE id(u) = {id}
        MERGE (t:Tag {name: {tag}})
        CREATE UNIQUE (u)-[:LIKED]->(t)
        RETURN *;`

      db.doDatabaseOperation(query, data)
        .then(data => resolve(data))
        .catch((err) => reject(err))
    })
  }

  Remove(data) {
    return new Promise((resolve, reject) => {
      const query =
          `MATCH (u: User)-[r:LIKED]->(t:Tag)
          WHERE id(u) = {id}
          AND t.name = {tag}
          DELETE r
          RETURN *;`

        db.doDatabaseOperation(query, data)
          .then(data => resolve(data))
          .catch((err) => reject(err))
    })
  }
}
