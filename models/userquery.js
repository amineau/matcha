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
                RETURN id(u) as id;`;
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
                RETURN id(u) as id;`;
            db.doDatabaseOperation(query, data)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    SetLogin(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u:User)
                WHERE id(u) = {id}
                SET u.login = {login}
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

    SetEmail(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u:User)
                WHERE id(u) = {id}
                SET u.email = {email}
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

    SetFirstName(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u:User)
                WHERE id(u) = {id}
                SET u.firstName = {firstName}
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

    SetLastName(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u:User)
                WHERE id(u) = {id}
                SET u.lastName = {lastName}
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

    GetById(data) {
        return new Promise((resolve, reject) => {
            const query =
                `MATCH (u: User)
                WHERE id(u) = {id}
                RETURN id(u) as id, u as all;`;
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