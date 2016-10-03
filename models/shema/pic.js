"use strict";

const db = require("../../db");

module.exports = class PicQuery {

    Count(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)-[]->(i :Img)
                WHERE id(u) = {id}
                RETURN count(i) as count;`;

            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    Add(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)
                WHERE id(u) = {id}
                CREATE(new: Img {name: {pic}})
                CREATE(u)-[p:OWNER {index: {index}}]->(new)
                RETURN id(new) as id;`;

            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    Delete(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)-[r:OWNER]->(i: Img)
                WHERE id(u) = {idUser}
                AND id(i) = {idPic}
                DELETE (r)
                RETURN *;`;
            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }
};