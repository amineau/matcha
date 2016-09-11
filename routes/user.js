/*jshint node:true */

"use strict";

const user = require('../handlers/user');

module.exports = (app) => {

	app.post('/auth/signup', user.signUp);
	app.post('/user/idbylog', user.getIdByLogin);
	app.get('/user/:id', user.getUserById);
};