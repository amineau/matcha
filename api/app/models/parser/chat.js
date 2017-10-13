'use strict'

const Validator = require('./validator')

module.exports = class ChatValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
        super(toParse, {
            comment: {
              funct: e => e,
              maxLength: 3000,
              message: "Comment invalid"
            }
        })
    }
}
