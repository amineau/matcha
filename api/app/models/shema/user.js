"use strict";

const db = require("../../db")
const _  = require('lodash')

module.exports = class UserQuery {

    Create(data) {
        return new Promise((resolve, reject) => {
          let tab = []
          for (let key in data){
            tab.push(`${key}:{${key}}`)
          }
          const date = new Date().getTime()
          const query =
            `CREATE(u: User{${tab.join(', ')}, score: 0, localisation: 'self', dateCreate: ${date}, lastConnection: ${date}})
            RETURN *`

          db.doDatabaseOperation(query, data)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    }

    Connection(where) {
      return new Promise((resolve, reject) => {
        const date = new Date().getTime()
        const query =
          `MATCH (u: User)
          WHERE id(u) = {id}
          SET u.lastConnection = ${date}
          RETURN *`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    Get(where, userId) {
      return new Promise((resolve, reject) => {
        let toWhere = []
        for (let key in where) {
          toWhere.push(key === 'id' ? `${key}(u)={${key}}` : `u.${key}={${key}}`)
        }
       const query =
           `MATCH (u: User), (p: User)
            WHERE ${toWhere.join(' AND ')}
            AND id(p) = {userId}
            AND NOT (u)-[:BLOCKED]->(p)
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[b:BLOCKED]-(p)
            OPTIONAL MATCH (u)<-[r:REPORTED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id,
              u AS all,
              i.path AS path,
              count(i) AS likable,
              count(c) AS connected,
              count(l) AS like,
              count(b) AS blocked,
              count(r) AS reported`

        db.doDatabaseOperation(query, _.merge(where, userId))
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }


    GetPrivate(where) {
      return new Promise((resolve, reject) => {
        let toWhere = []
        for (let key in where) {
          toWhere.push(key === 'id' ? `${key}(u)={${key}}` : `u.${key}={${key}}`)
        }
       const query =
           `MATCH (u: User)
            WHERE ${toWhere.join(' AND ')}
            RETURN id(u) as id, u as all`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetPublic(where) {
      return new Promise((resolve, reject) => {
        let toWhere = []
        for (let key in where) {
          toWhere.push(key === 'id' ? `${key}(u)={${key}}` : `u.${key}={${key}}`)
        }
       const query =
           `MATCH (u: User)
            WHERE ${toWhere.join(' AND ')}
            RETURN id(u) as id, u as all`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetForSet(where) {
      return new Promise((resolve, reject) => {
        let toWhere = []
        for (let key in where) {
          toWhere.push(key === 'id' ? `${key}(u)<>{${key}}` : `u.${key}={${key}}`)
        }
       const query =
           `MATCH (u: User)
            WHERE ${toWhere.join(' AND ')}
            RETURN id(u) as id, u as all`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetLiked(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)-[t:LIKED]->(p:User)
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND NOT (u)-[:BLOCKED]-(p)
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like, t.timestamp AS timestamp
            ORDER BY timestamp DESC`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetLike(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)<-[t:LIKED]-(p:User)
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND NOT (u)-[:BLOCKED]-(p)
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(t) AS like, t.timestamp AS timestamp
            ORDER BY timestamp DESC`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetVisited(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)-[t:VISITED]->(p:User)
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND NOT (u)-[:BLOCKED]-(p)
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like, t.timestamp AS timestamp
            ORDER BY timestamp DESC`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetVisite(where) {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)<-[t:VISITED]-(p:User)
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND NOT (u)-[:BLOCKED]-(p)
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like, t.timestamp AS timestamp
            ORDER BY timestamp DESC`

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
        toWhere += ` AND u.score >= {min} AND u.score <= {max}`
        where.min = Number(where.score.min)
        where.max = Number(where.score.max)
        delete where.score
      }
      if (where.tags && where.tags.length) {
        match = ', (u)-[]-(t:Tag)'
        toWhere += ` AND t.name IN {tags}`
      }
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User), (p:User)${match}
            WHERE id(u) <> {id}
            AND id(p) = {id}
            AND NOT (u)-[:BLOCKED]-(p)
            AND (u.sex = p.prefer
              OR p.prefer = 'B'
              OR NOT(exists(p.prefer))
            )
            ${toWhere}
            OPTIONAL MATCH (u)-[h]-(i: Img)
            WHERE h.head = true
            OPTIONAL MATCH (u)<-[l:LIKED]-(p)
            OPTIONAL MATCH (u)<-[:LIKED]-(p), (u)-[c:LIKED]->(p)
            OPTIONAL MATCH (u)-[]-(t:Tag)-[]-(p)
            RETURN id(u) AS id, u AS all, i.path AS path, count(i) AS likable, count(c) AS connected, count(l) AS like, count(t) AS tags`

        db.doDatabaseOperation(query, where)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    GetLimit() {
      return new Promise((resolve, reject) => {
       const query =
           `MATCH (u: User)
            RETURN max(u.birthday)   AS age_min,
                   min(u.birthday)   AS age_max,
                   max(u.score) AS score`

        db.doDatabaseOperation(query, {})
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    Set(where, set) {
        return new Promise((resolve, reject) => {
          if (_.isEmpty(where) || _.isEmpty(set)) {
            return reject({error: 'Aucun champs de correspond à la base de donnée'})
          }
          let toWhere = []
          let toSet = []
          for (let key in where)
            toWhere.push(key === 'id' ? `${key}(u) = {${key}}` : `u.${key} = {${key}}`)
          for (let key in set) {
            if (set[key] === null) {
              toSet.push(`u.${key} = NULL`)
              delete set[key]
            } else {
              toSet.push(`u.${key} = {${key}}`)
            }
          }
          const query =
              `MATCH (u:User)
              WHERE ${toWhere.join(' AND ')}
              SET ${toSet.join(', ')}
              RETURN *`

          db.doDatabaseOperation(query, _.merge(where, set))
            .then(data => resolve(data))
            .catch(err => reject(err))
      })
    }

    SetLoc(where, set) {
        return new Promise((resolve, reject) => {
          const query =
              `MATCH (u:User)
              WHERE id(u) = {id}
              AND u.localisation = 'self'
              SET u.latitude = {latitude},
              u.longitude = {longitude}
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
