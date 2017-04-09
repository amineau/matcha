"use strict";

const db = require("../../db");

module.exports = class PicQuery {

    Count(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[]->(i :Img)
            WHERE id(u) = {id}
            RETURN count(i) as count;`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }

    Add(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)
            WHERE id(u) = {id}
            CREATE(new: Img {name: {pic}})
            CREATE(u)-[p:OWNER {head: {head}}]->(new)
            RETURN id(new) as id;`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Delete(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[r:OWNER]->(i: Img)
            WHERE id(u) = {id}
            AND id(i) = {idPic}
            DELETE (r)
            DELETE (i)
            RETURN *;`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    Clear(data) {
      return new Promise((resolve, reject) => {
        const query =
        `MATCH (u: User)-[r:OWNER]->(i: Img)
        WHERE id(u) = {id}
        SET r.head = 0
        RETURN *`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }

    Profile(data) {
      return new Promise((resolve, reject) => {
        const query =
        `MATCH (u: User)-[f:OWNER]->(l: Img)
        WHERE id(u) = {userId}
        SET f.head = 0
        WITH 1 AS dummy
        MATCH (u:User)-[t:OWNER]->(i: Img)
        WHERE id(u) = {userId} AND id(i) = {picId}
        SET t.head = 1
        RETURN *;`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }
}
