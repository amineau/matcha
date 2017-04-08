'use strict'

const Validator     = require('./validator')
const bcrypt        = require('bcrypt')
const saltRounds    = 10

function hash(password) {
    return bcrypt.hashSync(password, saltRounds)
}

function parseName(name) {
    let str = "";
    for(let i = 0; i < name.length; i++) {
        if (i == 0 || name.charAt(i - 1) == ' ' || name.charAt(i - 1) == '-')
            str += name.charAt(i).toUpperCase();
        else
            str += name.charAt(i).toLowerCase()
    }
    return str
}

module.exports = class UserValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
      super(toParse, {
        login: {
          funct: (e) => e,
          match: /^[a-z0-9'àâéèêôùûç\s_-]{1,50}$/i,
          message: 'Login incorrect'
        },
        email: {
          funct: (e) => e,
          match: /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
          message: 'Email incorrect'
        },
        firstName: {
          funct: parseName,
          match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
          message: 'Prénom incorrect'
        },
        lastName: {
          funct: parseName,
          match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
          message: 'Nom incorrect'
        },
        password: {
          funct: hash,
          match: /^(?=.*[0-9])(?=.*[a-z])([a-z0-9.!#$%&’*+/=?^_`{|}~-]{6,50})$/i,
          message: 'Mot de passe invalide'
        },
        id: {
          funct: (e) => e,
          match: /^[0-9]+$/,
          message: 'Id invalide'
        },
        sex: {
          funct: (e) => e,
          match: /^[MF]$/,
          message: 'Sexe invalide'
        },
        prefer: {
          funct: (e) => e,
          match: /^[MFB]$/,
          message: 'Préférence invalide'
        },
        bio: {
          funct: (e) => e,
          maxLength: 5000,
          message: "Message trop long"
        }
      })
    }
}
