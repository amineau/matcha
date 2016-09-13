/*jshint node:true */

"use strict";

const user = require('../handlers/user');

module.exports = (app) => {

	app.post('/auth/signup', user.signUp);
	app.post('/auth/signin', user.signIn);
	app.post('/auth/logout', user.logout);
	app.post('/user/idbylog', user.getIdByLogin);
	app.post('/user/setlogin', user.setLogin);
	app.post('/user/setemail', user.setEmail);
	app.get('/user/:id', user.getById);
};