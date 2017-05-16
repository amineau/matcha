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
              match: /^(.){1,300}$/,
              message: "Comment invalid"
            }
        })
    }
}
