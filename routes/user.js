/*jshint node:true */

"use strict";

const user = require('../handlers/user');

module.exports = (app) => {

	app.post('/auth/signup', user.signUp);
	app.post('/auth/signin', user.signIn);
	app.post('/user/idbylog', user.getIdByLogin);
	app.post('/user/set', user.setUser);
	app.get('/user/:id', user.getUserById);
};