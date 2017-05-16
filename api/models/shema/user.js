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
            RETURN *`

          db.doDatabaseOperation(query, data)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    }

    Get(where) {
      return new Promise((resolve, reject) => {
        let toWhere = ''
        for (let key in where) {
          toWhere += toWhere !== '' ? ` AND ` : ''
          toWhere += key === 'id' ? `${key}(u)={${key}}` : `u.${key}={${key}}`
        }
       const query =
           `MATCH (u: User)
            WHERE ${toWhere}
            RETURN id(u) as id, u as all`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetForSet(where) {
      return new Promise((resolve, reject) => {
        let toWhere = ''
        for (let key in where) {
          toWhere += toWhere !== '' ? ` AND ` : ''
          toWhere += key === 'id' ? `${key}(u)<>{${key}}` : `u.${key}={${key}}`
        }
       const query =
           `MATCH (u: User)
            WHERE ${toWhere}
            RETURN id(u) as id, u as all`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetLiked(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)-[:LIKED]->(p:User)
            WHERE id(u) <> {id}
            AND id(p) = {id}
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetAll(where) {
      let toWhere = ''
      let match = ''
      if (where.age) {
        if (where.age.min) {
          let min = new Date()
          min.setFullYear(min.getFullYear() - where.age.min)
          toWhere += ` AND u.birthday <= ${min.getTime()}`
        }
        if (where.age.max) {
          let max = new Date()
          max.setFullYear(max.getFullYear() - where.age.max)
          toWhere += ` AND u.birthday >= ${max.getTime()}`
        }
      }
      if (where.score) {
        toWhere += ` AND u.score >= ${where.score.min} AND u.score <= ${where.score.max}`
      }
      if (where.tags && where.tags.length) {
        match = ', (u)-[]-(t:Tag)'
        let tags = []
        where.tags.forEach(e => tags.push(`'${e}'`))
        console.log(tags)
        toWhere += ` AND (t.name=${tags.join(' OR t.name=')})`
      }
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User), (p:User)${match}
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND (u.sex = p.prefer
              OR p.prefer = 'B'
              OR NOT(exists(p.prefer))
            )
            ${toWhere}
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like`

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
              RETURN *`

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
