'use strict'

const user = require('../handlers/user')
const restrict = require('../models/restrict')

module.exports = (app) => {

	app.post('/auth/signup', user.signUp)
	app.post('/auth/signin', user.signIn)

	app.put('/user/', restrict, user.set)

	app.get('/user/:by/:data', restrict, user.get)
	app.delete('/user/', restrict, user.delete)

}
