'use strict'

const Validator = require('./validator')

module.exports = class PicValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
        super(toParse, {
            base64: {
              funct: e => e,
              match: /^.*$/,
              message: "Photo invalide"
            },
            head: {
              funct: e => e === 'true' ? true : false,
              match: /^(true|false)$/,
              message: 'Head accepte les valeurs "true" et "false" uniquement'
            }
        })
    }
}
