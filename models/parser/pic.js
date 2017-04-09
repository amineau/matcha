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
              message: "Tag invalide"
            },
            head: {
              funct: e => e,
              match: /^[01]$/,
              message: 'Id invalide'
            }
        })
    }
}
