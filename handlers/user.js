/*jshint node:true */

'use strict';

const ParserDb	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const parser = new ParserDb();

function reqDatabase(query, params, parser, res) {
	const showSucces = (data) => {
		res.json(data);
	};
	const showError = (err) => {
		res.json(err);
	};

	return db.doDatabaseOperation(query, params, parser)
			.then(showSucces)
			.catch(showError);
}

exports.signUp = (req, res) => {

	const sha256 	= crypto.createHash("sha256");
	const user 		= req.query;
	const query 	=
		`CREATE(user: User {
			login: {login},
			email: {email},
			firstName: {firstName},
			lastName: {lastName},
			password: {password}
		})
		RETURN *;`;
	const params 	= {
		'login': user.login,
		'email': user.email,	
		'firstName': user.firstName,
		'lastName': user.lastName,
		'password': sha256.update(user.password).digest("base64")
	};

	reqDatabase(query, params, parser.getTrue, res);
};

exports.signIn = (req, res) => {
	const sha256 	= crypto.createHash("sha256");
	const user 		= req.query;
	const query 	=
		`MATCH (u:User)
		WHERE u.login = {login}
		AND u.password = {password}
		RETURN u`;
	const params 	= {
		'login': user.login,
		'password': sha256.update(user.password).digest("base64")
	};

	const showSucces = (data) => {
		req.session.userId = data.id[0];
		res.json({success: true});
	};

	const showError = (err) => {
		res.json({success: false, err: err});
	};

	db.doDatabaseOperation(query, params, parser.getIds)
		.then(showSucces)
		.catch(showError);
};

exports.getIdByLogin = (req, res) => {
	const login		= req.query.login;
	const query		= 
		`MATCH (u:User)
		WHERE u.login = {login}
		RETURN u;`;
	const params	= {'login': login};

	reqDatabase(query, params, parser.getIds, res);
};

exports.getIdByEmail = (req, res) => {
	const email		= req.query.email;
	const query		=
		`MATCH (u:User)
		WHERE u.email = {email}
		RETURN u;`;
	const params	= {'email': email};

	reqDatabase(query, params, parser.getIds, res);
};

exports.getUserById = (req, res) => {
	const id		= Number(req.params.id);
	const query		=
		`MATCH (u:User)		
		WHERE id(u) = {id}
		RETURN u;`;
	const params	= {'id': id};

	reqDatabase(query, params, parser.getData, res);
};

exports.setUser = (req, res) => {
	const user		= req.query;
	const query		= 
		`MATCH (u:User)
		WHERE id(u) = {id}
		SET u += {user}
		RETURN u;`;
	const params	= {
		'id': req.session.userId,
		user
	};
	reqDatabase(query, params, parser.getDebug, res);
};