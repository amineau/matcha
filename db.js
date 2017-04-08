"use strict";

const request	= require('request');
const confDb	= require('./config/db');

const txUrl = "http://" + confDb.user + ":" + confDb.pass + "@" + confDb.host + ":" + confDb.port + "/db/data/transaction/commit";

exports.doDatabaseOperation = (query, params) => {
	return new Promise(function (resolve, reject) {
		console.log('params :', params, '\nquery :', query)
		request.post({
			uri: txUrl,
			json: {
				statements: [{
					statement: query,
					parameters: params
				}]
			}
		}, (err, res) => {
			console.log("err :", err, '\nres :', res.body)
	    	if (err)
	    		reject({
	    			status: 500,
	    			error: err
	    		});
	    	else
		    	resolve(res.body);
	    });
	});
};
