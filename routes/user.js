"use strict";

const user = require('../handlers/user');

module.exports = (app) => {


	app.post('/auth/signup', user.signUp);
	app.post('/auth/signin', user.signIn);
	app.post('/auth/logout', user.logout);
	app.put('/user/setlogin', user.setLogin);
	app.put('/user/setemail', user.setEmail);
	app.put('/user/setpassword', user.setPassword);
	app.put('/user/setfirstname', user.setFirstName);
	app.put('/user/setlastName', user.setLastName);
	app.put('/user/setsex', user.setSex);
	app.put('/user/setprefer', user.setPrefer);

	app.get('/user/email/:email', user.getIdByEmail);
	app.get('/user/login/:login', user.getIdByLogin);
	app.get('/user/:id', user.getById);
};