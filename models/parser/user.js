'use strict'

const Validator = require('./validator')
const conf = require('../../config/conf')
const bcrypt = require('bcrypt')

function hash (str) {
    return bcrypt.hashSync(str, conf.bcrypt.saltRounds)
}

function parseName (name) {
    let str = ''
    for (let i = 0; i < name.length; i++) {
        if (i === 0 || name.charAt(i - 1) === ' ' || name.charAt(i - 1) === '-') {
            str += name.charAt(i).toUpperCase()
        } else {
            str += name.charAt(i).toLowerCase()
        }
    }
    return str
}

module.exports = class UserValidator extends Validator {

    /**
     * Constructor
     */
    constructor (toParse) {
        super(toParse, {

            login: {
                match: /^[a-z0-9'àâéèêôùûç\s_-]{1,50}$/i,
                message: 'Login incorrect'
            },
            firstName: {
                action: parseName,
                match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
                message: 'Ne peut pas être vide et doit avoir des caractères valides. Sa taille ne doit pas dépasser 50 caratères.'
            },
            email: {
                match: /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
                message: 'Doit avoir un format valide.'
            },
            lastName: {
                action: parseName,
                match: /^[a-z'àâéèêôùûç\s-]{1,50}$/i,
                message: 'Ne peut pas être vide et doit avoir des caractères valides. Sa taille ne doit pas dépasser 50 caratères.'
            },
            password: {
                action: hash,
                match: /^(?=.*[0-9])(?=.*[a-z])([a-z0-9.!#$%&’*+/=?^_`{|}~-]{6,100})$/i,
                message: 'Ne doit pas faire moins de 6 caractères avec au minimum un chiffre et une lettre.'
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
                match: /^.{0,5000}$/,
                message: '5000 caractères maximum'
            }
        })
    }
}
