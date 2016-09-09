'use strict'

const express 		= require("express")
const _ 			= require("underscore");
const Validation	= require("../models/validation")
const db			= require("../db")


exports.signUp = (req, res) => {

	const showSucces = (data) => {
		res.send(200, data)
	}
	const showError = (err) => {
		res.send(400, err)
	}
	const createOne = (user) => {

			const query = 'CREATE(user: User { login: {login}, email: {email}, firstName: {firstName}, lastName: {lastName}, password: {password} }) RETURN *'
			const params = {
					'login': user.login,
					'email': user.email,
					'firstName': user.firstName,
					'lastName': user.lastName,
					'password': user.password
				}
			db.doDatabaseOperation(query, params)
				.then(showSucces)
				.catch(showError)
	}
	return createOne(req.query)
}