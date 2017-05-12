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
            CREATE(u)-[p:OWNER {head: true}]->(new:Img {path: {path}})
            WITH p, id(new) AS id, u
            MATCH (u)-[o:OWNER]->(:Img)
            WHERE id(o) <> id(p)
            SET p.head = false
            RETURN id LIMIT 1`

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
          `MATCH (u: User)-[h:OWNER]->(i: Img)
          WHERE id(u) = {id}
          RETURN id(i) AS id, i AS all, h.head AS head
          ORDER BY head DESC`

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
            AND id(i) = {picId}
            AND r.head = false
            WITH i, i.path AS photoPath
            DETACH DELETE i
            RETURN photoPath`

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
