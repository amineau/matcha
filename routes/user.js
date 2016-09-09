'use strict'

const user = require('../handlers/user')

module.exports = (app) => {

	app.post('/auth/signup', user.signUp)
}