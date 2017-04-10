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
            RETURN id(new) as id`

          db.doDatabaseOperation(query, data)
            .then((data) => resolve(data))
            .catch((err) => reject(err))
      })
    }

    GetProfil(data) {
      return new Promise((resolve, reject) => {
        const query =
          `MATCH (u: User)-[r: OWNER]->(i: Img)
          WHERE id(u) = {id}
          AND r.head = true
          RETURN i as photo`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }

    Get(data) {
      return new Promise((resolve, reject) => {
        const query =
          `MATCH (u: User)-[]->(i: Img)
          WHERE id(u) = {id}
          RETURN i as photo`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }

    Delete(data) {
      return new Promise((resolve, reject) => {
        const query =
            `MATCH (u: User)-[r:OWNER]->(i: Img)
            WHERE id(u) = {userId}
            AND id(i) = {picId}
            AND r.head = false
            DETACH DELETE i`

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
        AND r.head = true
        SET r.head = false`

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
        AND f.head = true
        AND id(l) <> {picId}
        SET f.head = false
        WITH 1 AS dummy
        MATCH (u:User)-[t:OWNER]->(i: Img)
        WHERE id(u) = {userId}
        AND t.head = false
        AND id(i) = {picId}
        SET t.head = true`

        db.doDatabaseOperation(query, data)
          .then((data) => resolve(data))
          .catch((err) => reject(err))
      })
    }
}
