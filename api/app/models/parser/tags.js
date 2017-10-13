'use strict'

const Validator = require('./validator')

module.exports = class TagsValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
        super(toParse, {
            tag: {
              funct: e => e,
              maxLength: 30,
              message: "Tag invalide"
            }
        })
    }
}
