'use strict';

const user = require('../handlers/user');

module.exports = (app) => {


	app.post('/auth/signup', user.signUp)
	app.post('/auth/signin', user.signIn)
	app.post('/auth/logout', user.logout)

	app.put('/user/', user.set)

	app.get('/user/:by/:data', user.get)
}
