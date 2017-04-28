'use strict'

const _  = require('lodash')
const db = require("../../db")
const conf = require("../../config/conf.json")

module.exports = class ConnexionQuery {

    Like(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)-[:OWNER]-(:Img)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            OPTIONAL MATCH (u)-[r:UNLIKED]->(i)
            DELETE r
            MERGE (u)-[l:LIKED]->(i)
            ON CREATE SET i.score = i.score + {score},
            l.notif = true,
            l.timestamp = {now}`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.like}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Connected(data) {
      return new Promise ((resolve, reject) => {
        const query =
        `MATCH (u: User), (i: User), (u)-[:LIKED]->(i), (i)-[:LIKED]->(u)
        WHERE id(u) = {userId}
        AND id(i) = {id}
        RETURN count(u) AS count`

        db.doDatabaseOperation(query, data)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }

    Block(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            MERGE (u)-[:BLOCKED]->(i)
            ON CREATE SET i.score = i.score + {score}`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.block}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Unlike(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[l:LIKED]->(i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            CREATE (u)-[r:UNLIKED]->(i)
            DELETE l
            SET i.score = i.score - {score},
            r.timestamp = {now}
            WITH u, i, r
            MATCH (u)<-[:LIKED]-(i)
            SET r.notif = true`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.like}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Unblock(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[r:BLOCKED]->(i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            DELETE r
            SET i.score = i.score - {score}`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.block}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Report(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            MERGE (u)-[r:REPORTED]->(i)
            ON CREATE SET i.score = i.score + {score}
            SET r.message = {message},`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.report}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Visite(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            MERGE (u)-[v:VISITED]->(i)
            ON CREATE SET i.score = i.score + {score}
            SET v.notif = true,
            v.timestamp = {now}`

          db.doDatabaseOperation(query, _.merge(data, {score: conf.score.visite}))
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    LikedBy(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)<-[:LIKED]-(i: User)
            WHERE id(u) = {id}
            RETURN i`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Liked(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[:LIKED]->(i: User)
            WHERE id(u) = {id}
            RETURN i`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Bloked(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[:BLOCKED]->(i: User)
            WHERE id(u) = {id}
            RETURN i`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }


}
