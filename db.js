/*jshint node:true */

"use strict";

const request	= require('request');
const confDb	= require('./config/db');

const txUrl = "http://" + confDb.user + ":" + confDb.pass + "@" + confDb.host + ":" + confDb.port + "/db/data/transaction/commit";

exports.doDatabaseOperation = (query, params, parser) => {
	return new Promise(function (resolve, reject) {
		request.post({
			uri: txUrl,
			json: {
				statements: [{
					statement: query,
					parameters: params
				}]
			}
		}, (err, res) => {
	    	if (err)
	    		reject("send mail to amineau@student.42.fr for report err:" + err);
	    	else
		    	resolve(parser(res.body));
	    });
	});
};