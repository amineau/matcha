'use strict'

const Validator = require('./validator')

module.exports = class ConnexionValidator extends Validator {

    /**
     * Constructor
     */
    constructor(toParse) {
        super(toParse, {
            message: {
              funct: e => e,
              maxLength: 250,
              message: "Message trop long"
            }
        })
    }
}
