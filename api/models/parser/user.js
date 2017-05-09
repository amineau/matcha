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
          funct: e => e,
          match: /^[a-z0-9'àâéèêôùûç\s_-]{1,50}$/i,
          message: 'Caractère(s) incorrect(s)'
        },
        email: {
          funct: e => e,
          match: /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
          message: 'Format de l\'email invalide'
        },
        firstName: {
          funct: parseName,
          match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
          message: 'Caractère(s) incorrect(s)'
        },
        lastName: {
          funct: parseName,
          match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
          message: 'Caractère(s) incorrect(s)'
        },
        birthday: {
          funct: e => e,
          match: /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
          message: 'Format de la date invalide dd/mm/yyyy'
        },
        password: {
          funct: hash,
          match: /^(?=.*[0-9])(?=.*[a-z])(.{6,50})$/i,
          message: 'Doit contenir entre 6 et 50 caractères et au moins une lettre et un chiffre'
        },
        id: {
          funct: e => e,
          match: /^[0-9]+$/,
          message: 'Id invalide'
        },
        sex: {
          funct: e => e,
          match: /^[MW]$/,
          message: 'Sexe invalide'
        },
        prefer: {
          funct: e => e,
          match: /^[MWB]$/,
          message: 'Préférence invalide'
        },
        bio: {
          funct: e => e,
          maxLength: 300,
          message: "Message trop long"
        }
      })
    }
}
