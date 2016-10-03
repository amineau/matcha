"use strict";

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

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
            },
            sex: {
                match: /^[MF]$/,
                message: 'Sexe invalide'
            },
            prefer: {
                match: /^[MFB]$/,
                message: 'Préférence invalide'
            },
            bio: {
                maxLength: 5000,
                message: "Message trop long"
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

    ParseAuth() {
        return Promise.resolve()
            .then(() => this.ParserLogin())
            .then(() => this.GetResult());
    }

    ParseLogin(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserLogin())
            .then(() => this.GetResult());
    }

    ParseEmail(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserEmail())
            .then(() => this.GetResult());
    }

    ParsePassword(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserPassword())
            .then(() => this.GetResult());
    }

    ParseFirstName(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserFirstName())
            .then(() => this.GetResult());
    }

    ParseLastName(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserLastName())
            .then(() => this.GetResult());
    }

    ParseSex(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserSex())
            .then(() => this.GetResult());
    }

    ParsePrefer(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserPrefer())
            .then(() => this.GetResult());
    }

    ParseBio(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserBio())
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
            else {
                reject({
                    status: 403,
                    error: this._errors[0]
                });
            }
        })
    }

    ParserLogin() {
        return new Promise((resolve) => {
            const login = this._toParse.login;
                if (login && login.match(this._parser.login.match))
                    this._parsed.login = login;
                else
                    this._errors.push({key: "login", message: this._parser.login.message});
            resolve(this._parsed);
        });
    }

    ParserEmail() {
        return new Promise((resolve) => {
            const email = this._toParse.email;
                if (email && email.match(this._parser.email.match))
                    this._parsed.email = email;
                else
                    this._errors.push({key: "email", message: this._parser.email.message});
            resolve(this._parsed);
        });
    }

    ParserFirstName() {
        return new Promise((resolve) => {
            const firstName = this._toParse.firstName;
                if (firstName && firstName.match(this._parser.firstName.match))
                    this._parsed.firstName = parseName(firstName);
                else
                    this._errors.push({key: "firstName", message: this._parser.firstName.message});
            resolve(this._parsed);
        });
    }

    ParserLastName() {
        return new Promise((resolve) => {
            const lastName = this._toParse.lastName;
                if (lastName && lastName.match(this._parser.lastName.match))
                    this._parsed.lastName = parseName(lastName);
                else
                    this._errors.push({key: "lastName", message: this._parser.lastName.message});
            resolve(this._parsed);
        });
    }

    ParserPassword() {
        return new Promise((resolve) => {
            const password = this._toParse.password;
                if (password && password.match(this._parser.password.match))
                    this._parsed.password = hash(password);
                else
                    this._errors.push({key: "password", message: this._parser.password.message});
            resolve(this._parsed);
        });
    }

    ParserSex() {
        return new Promise((resolve) => {
            const sex = this._toParse.sex;
            if (sex && sex.match(this._parser.sex.match))
                this._parsed.sex = sex;
            else
                this._errors.push({key: "sex", message: this._parser.sex.message});
            resolve(this._parsed);
        });
    }

    ParserPrefer() {
        return new Promise((resolve) => {
            const prefer = this._toParse.prefer;
            if (prefer && prefer.match(this._parser.prefer.match))
                this._parsed.prefer = prefer;
            else
                this._errors.push({key: "prefer", message: this._parser.prefer.message});
            resolve(this._parsed);
        });
    }

    ParserBio() {
        return new Promise((resolve) => {
            const bio = this._toParse.bio;
            if (bio && bio.length <= this._parser.bio.maxLength)
                this._parsed.bio = bio;
            else
                this._errors.push({key: "bio", message: this._parser.bio.message});
            resolve(this._parsed);
        });
    }

    ParserId() {
        return new Promise((resolve) => {
            const id = this._toParse.id;
            if (id != null && id.toString().match(this._parser.id.match))
                this._parsed.id = id;
            else
                this._errors.push(this._parser.id.message);
            resolve(this._parsed);
        })
    }

};