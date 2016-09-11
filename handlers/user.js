/*jshint node:true */

'use strict';

const express 		= require("express");
const _ 			= require("underscore");
const Validation	= require("../models/validation");
const Parser	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const ParserDb = new Parser();

function reqDatabase(query, params, parser, res) {
	const showSucces = (data) => {
		res.status(200).send(data);
	};
	const showError = (err) => {
		res.status(400).send(err);
	};

	return db.doDatabaseOperation(query, params, parser)
			.then(showSucces)
			.catch(showError);
}

exports.signUp = (req, res) => {

	const sha256 	= crypto.createHash("sha256");
	const user 		= req.query;
	const query 	= 'CREATE(user: User { login: {login}, email: {email}, firstName: {firstName}, lastName: {lastName}, password: {password} }) RETURN *;';
	const params 	= {
		'login': user.login,
		'email': user.email,	
		'firstName': user.firstName,
		'lastName': user.lastName,
		'password': sha256.update(user.password).digest("base64")
	};

	reqDatabase(query, params, ParserDb.getIds, res);
};

exports.getIdByLogin = (req, res) => {
	const login		= req.query.login;
	const query		= 'MATCH (u:User) WHERE u.login = {login} RETURN u;';
	const params	= {'login': login};

	reqDatabase(query, params, ParserDb.getIds, res);
};

exports.getIdByEmail = (req, res) => {
	const email		= req.query.email;
	const query		= 'MATCH u: User WHERE u.email = {email} RETURN u;';
	const params	= {'email': email};

	reqDatabase(query, params, ParserDb.getIds, res);
};

exports.getUserById = (req, res) => {
	const id		= req.params.id;
	const query		= 'MATCH u: User WHERE id(u) = {id} RETURN u;';
	const params	= {'id': id};

	reqDatabase(query, params, ParserDb.getData, res);
};