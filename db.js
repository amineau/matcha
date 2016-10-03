"use strict";

const request	= require('request');
const confDb	= require('./config/db');

//const txUrl = "http://" + confDb.user + ":" + confDb.pass + "@" + confDb.host + ":" + confDb.port + "/db/data/transaction/commit";

const txUrl = "http://" + confDb.user + ":.eut420.@localhost:" + confDb.port + "/db/data/transaction/commit";
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
	    		});
	    	else
		    	resolve(res.body);
	    });
	});
};