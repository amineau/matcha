'use strict'

const Validator = require('./validator')

module.exports = class TagsValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
        super(toParse, {
            pic: {
              funct: e => e,
              maxLength: 30,
              message: "Pic invalide"
            },
            head: {
              funct: e => e === 'true' ? true : false,
              match: /^(true|false)$/,
              message: 'Head accepte les valeurs "true" et "false" uniquement'
            }
        })
    }
}
