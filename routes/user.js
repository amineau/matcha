"use strict";

const user = require('../handlers/user');

module.exports = (app) => {


	app.post('/auth/signup', user.signUp);
	app.post('/auth/signin', user.signIn);
	app.post('/auth/logout', user.logout);
	app.put('/user/login', user.setLogin);
	app.put('/user/email', user.setEmail);
	app.put('/user/password', user.setPassword);
	app.put('/user/firstname', user.setFirstName);
	app.put('/user/lastName', user.setLastName);
	app.put('/user/sex', user.setSex);
	app.put('/user/prefer', user.setPrefer);

	app.get('/user/email/:email', user.getIdByEmail);
	app.get('/user/login/:login', user.getIdByLogin);
	app.get('/user/:id', user.getById);
};