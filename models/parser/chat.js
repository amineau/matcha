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
              match: /^.{1,250}$/,
              message: "Comment invalid"
            }
        })
    }
}
