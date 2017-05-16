'use strict'

const user = require('../handlers/user')
const restrict = require('../models/restrict')

module.exports = (app) => {

	app.post('/auth/signup', user.signUp)
	app.post('/auth/signin', user.signIn)

	app.put('/user', restrict, user.set)

	app.get('/users', restrict, user.getAll)
	app.get('/users/liked', restrict, user.getLiked)
	app.get('/users/like', restrict, user.getLike)
	app.get('/users/visited', restrict, user.getVisited)
	app.get('/users/visite', restrict, user.getVisite)
	app.get('/user/:by/:data', restrict, user.getByData)

	app.delete('/user', restrict, user.delete)

}
