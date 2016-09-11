/*jshint node:true */

"use strict";

const regLog 	= /^[a-zA-Z0-9'àâéèêôùûçÀÂÉÈÔÙÛÇ\s_-]{1,50}$/;
const regMail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const regName	= /^[a-zA-Z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{1,50}$/;

	function login(value) {
		if (value && value.match(regLog))
			return true;
		return false;
	}

	function email(value) {
		if (value && value.match(regMail))
			return true;
		return false;
	}

	function name(value) {
		if (value && value.match(regName))
			return true;
		return false;
	}

	function pass(value) {
		if (value && value.length >= 6 && value.match(/[a-zA-Z]/) && value.match(/[0-9]/))
			return true;
		return false;
	}

exports.verif = (user) => {
	let res 	= {};

	if (!user) {
		res.error.user = 1;
		return res;
	}
	if (!login(user.login))
		res.error.login = 1;
	if (!email(user.email))
		res.error.email = 1;
	if (!name(user.firstName))
		res.error.firstName = 1;
	if (!name(user.lastName))
		res.error.lastName = 1;
	if (!pass(user.password))
		res.error.password = 1;
	return res;
};