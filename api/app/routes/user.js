'use strict'

const user = require('../handlers/user')
const restrict = require('../models/restrict')

const passport      = require('passport')
const conf          = require('../config/conf.json')

module.exports = (app) => {

	app.post('/auth/signup', user.signUp)
	app.post('/auth/signin', user.signIn)
	app.post('/auth/forgotpassword', user.forgotPassword)
	app.post('/auth/changepassword/:linkPassword', user.changePassword)

	app.put('/user', restrict, user.set)
	app.put('/user/loc', restrict, user.setLoc)
	app.put('/user/password', restrict, user.setPassword)

	app.get('/users', restrict, user.getAll)
	app.get('/users/liked', restrict, user.getLiked)
	app.get('/users/like', restrict, user.getLike)
	app.get('/users/visited', restrict, user.getVisited)
	app.get('/users/visite', restrict, user.getVisite)
	app.get('/user/:by/:data', restrict, user.getByData)
	app.get('/user/limits', restrict, user.limits)
	app.get('/user/public/:by/:data', user.getPublic)

	app.delete('/user', restrict, user.delete)



}
