"use strict";

const request = require('request');
const db = require('./config/conf').db;

const txUrl = `http://${db.user}:${db.pass}@${db.host}:${db.port}/db/data/transaction/commit`

exports.doDatabaseOperation = (query, params) => {
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
	    		reject({
	    			status: 500,
	    			error: err
	    		})
	    	else
		    	resolve(res.body)
	    })
	})
}