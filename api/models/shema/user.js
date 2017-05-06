"use strict";

const db = require("../../db")
const _  = require('lodash')

module.exports = class UserQuery {

    Create(data) {
        return new Promise((resolve, reject) => {
          let tab = ''
          for (let key in data)
            tab += `${key}:{${key}},`
          const query =
            `CREATE(u: User{${tab} score: 0})
            RETURN *;`

          db.doDatabaseOperation(query, data)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    }

    Get(where) {
      return new Promise((resolve, reject) => {
        let toWhere = ''
        for (let key in where)
          toWhere += key === 'id' ? `${key}(u)={${key}}AND` : `u.${key}={${key}}AND`
       const query =
           `MATCH (u: User)
            WHERE ${toWhere.slice(0, -3)}
            RETURN id(u) as id, u as all;`;

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetAll(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)
            RETURN id(u) as id, u as all;`;

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    Set(where, set) {
        return new Promise((resolve, reject) => {
          if (_.isEmpty(where) || _.isEmpty(set)) {
            return reject({error: 'Aucun champs de correspond à la base de donnée'})
          }
          let toWhere = ''
          let toSet = ''
          for (let key in where)
            toWhere += key === 'id' ? `${key}(u)={${key}}AND` : `u.${key}={${key}}AND`
          for (let key in set)
            toSet += `u.${key}={${key}},`
          const query =
              `MATCH (u:User)
              WHERE ${toWhere.slice(0, -3)}
              SET ${toSet.slice(0, -1)}
              RETURN *;`;

          db.doDatabaseOperation(query, _.merge(where, set))
            .then(data => resolve(data))
            .catch(err => reject(err))
      })
    }

    Delete(id) {
      return new Promise((resolve, reject) => {
        const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        DETACH DELETE u`

      db.doDatabaseOperation(query, {id})
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }
}
