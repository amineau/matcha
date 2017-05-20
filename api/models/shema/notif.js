'use strict'

const db = require("../../db")
const _  = require('lodash')

module.exports = class NotifQuery {

    ReadNotif(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH p=(u: User)<-[r]-(i: User)
            WHERE id(u) = {userId}
            AND exists(r.notif)
            AND NOT (u)-[:BLOCKED]->(i)
            OPTIONAL MATCH (i)-[l]-(e:Img)
            WHERE l.head = true
            RETURN id(i) AS id, i AS all, r AS link, type(r) AS action, e.path AS path
            ORDER BY link.timestamp DESC`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    NotifToFalse(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH p=(u: User)<-[r]-(i: User)
            WHERE id(u) = {userId}
            AND r.notif = true
            SET r.notif = false`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }
}
