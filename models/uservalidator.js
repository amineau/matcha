"use strict";

const bcrypt        = require('bcrypt');
const saltRounds    = 7;

function hash(password) {
    return bcrypt.hashSync(password, saltRounds);
}

function parseName(name) {
    let str = "";
    for(let i = 0; i < name.length; i++) {
        if (i == 0 || name.charAt(i - 1) == ' ' || name.charAt(i - 1) == '-')
            str += name.charAt(i).toUpperCase();
        else
            str += name.charAt(i).toLowerCase();
    }
    return str;
}

module.exports = class UserValidator {

    /**
     * Constructor
     */
    constructor(toParse) {
        this._toParse = toParse;
        this._parsed = {};
        this._errors = [];
        this._parser = {
            login: {
                match: /^[a-z0-9'àâéèêôùûç\s_-]{1,50}$/i,
                message: 'Login incorrect'
            },
            email: {
                match: /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
                message: 'Email incorrect'
            },
            firstName: {
                match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
                message: 'Prénom incorrect'
            },
            lastName: {
                match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
                message: 'Nom incorrect'
            },
            password: {
                match: /^(?=.*[0-9])(?=.*[a-z])([a-z0-9.!#$%&’*+/=?^_`{|}~-]{6,50})$/i,
                message: 'Mot de passe invalide'
            },
            id: {
                match: /^[0-9]+$/,
                message: 'Id invalide'
            }
        };
    }

    /**
     * @description [description]
     * @public
     * @return {Promise}
     */
    ParseRegister() {
        return Promise.resolve()
            .then(() => this.ParserLogin())
            .then(() => this.ParserEmail())
            .then(() => this.ParserFirstName())
            .then(() => this.ParserLastName())
            .then(() => this.ParserPassword())
            .then(() => this.GetResult());
    }

    ParseConnexion() {
        return Promise.resolve()
            .then(() => this.ParserLogin())
            .then(() => this.ParserPassword())
            .then(() => this.GetResult());
    }

    ParseId() {
        return Promise.resolve()
            .then(() => this.ParserId())
            .then(() => this.GetResult());
    }

    GetResult() {
        return new Promise((resolve, reject) => {
            if (this._errors.length == 0)
                resolve(this._parsed);
            else
                reject({
                    status: 403,
                    error: this._errors[0]
                });
        })
    }

    ParserLogin() {
        return new Promise((resolve) => {
            const login = this._toParse.login;
                if (login && login.match(this._parser.login.match))
                    this._parsed.login = login;
                else
                    this._errors.push({key: "login", message: this._parser.login.message})
            resolve(this._parsed);
        });
    }

    ParserEmail() {
        return new Promise((resolve) => {
            const email = this._toParse.email;
                if (email && email.match(this._parser.email.match))
                    this._parsed.email = email;
                else
                    this._errors.push({key: "email", message: this._parser.email.message})
            resolve(this._parsed);
        });
    }

    ParserFirstName() {
        return new Promise((resolve) => {
            const firstName = this._toParse.firstName;
                if (firstName && firstName.match(this._parser.firstName.match))
                    this._parsed.firstName = parseName(firstName);
                else
                    this._errors.push({key: "firstName", message: this._parser.firstName.message})
            resolve(this._parsed);
        });
    }

    ParserLastName() {
        return new Promise((resolve) => {
            const lastName = this._toParse.lastName;
                if (lastName && lastName.match(this._parser.lastName.match))
                    this._parsed.lastName = parseName(lastName);
                else
                    this._errors.push({key: "lastName", message: this._parser.lastName.message})
            resolve(this._parsed);
        });
    }

    ParserPassword() {
        return new Promise((resolve) => {
            const password = this._toParse.password;
                if (password && password.match(this._parser.password.match))
                    this._parsed.password = hash(password);
                else
                    this._errors.push({key: "password", message: this._parser.password.message})
            resolve(this._parsed);
        });
    }

    ParserId() {
        return new Promise((resolve) => {
            const id = this._toParse.id;
            if (id && id.match(this._parser.id.match))
                this._parsed.id = Number(id);
            else
                this._errors.push(this._parser.id.message);
            resolve(this._parsed);
        })
    }
};