"use strict";

const db = require("../db");

module.exports = class UserQuery {

    AddUser(data) {
        return new Promise((resolve, reject) => {
            const query =
                `CREATE(user: User {
                    login: {login},
                    email: {email},
                    firstName: {firstName},
                    lastName: {lastName},
                    password: {password}
                })
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

    GetPassword(data) {
        return new Promise((resolve, reject) => {
            const query 	=
                `MATCH (u:User)
                WHERE u.login = {login}
                RETURN id(u) as id, u.password as password`;

            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    GetByEmail(data) {
        return new Promise((resolve, reject) => {
           const query =
               `MATCH (u: User)
                WHERE u.email = {email}
                RETURN u;`;
            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    GetByLogin(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)
                WHERE u.login = {login}
                RETURN u;`;
            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    GetById(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)
                WHERE id(u) = {id}
                RETURN u;`;
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