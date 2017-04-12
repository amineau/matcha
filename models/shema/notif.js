'use strict'

const _  = require('lodash')
const db = require("../../db")
const conf = require("../../config/conf.json")

module.exports = class NotifQuery {

    Notif(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH p=(u: User)<-[r]-(i: User)
            WHERE id(u) = {userId}
            AND exists(r.notif)
            WITH r
            ORDER BY r.timestamp DESC
            SET r.notif = false
            `

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }
}

// RETURN then SET impossible ? if confirm, to create two query
