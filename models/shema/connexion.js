'use strict'

const db = require("../../db")

module.exports = class ConnexionQuery {

    Like(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)-[:OWNER]-(:Img)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            CREATE UNIQUE (u)-[:LIKED]->(i)`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Block(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User), (i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            CREATE UNIQUE (u)-[:BLOCKED]->(i)`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Unlike(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[r:LIKED]->(i: User)
            WHERE id(u) = {userId}
            AND id(i) = {id}
            DELETE r`

          db.doDatabaseOperation(query, data)
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
            DELETE r`

          db.doDatabaseOperation(query, data)
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
            CREATE UNIQUE (u)-[r:REPORTED]->(i)
            SET r.message = {message}`

          db.doDatabaseOperation(query, data)
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


}
