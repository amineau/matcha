"use strict";

const request = require('request');
const db = require('./config/conf').neo4j;

const txUrl = `http://${db.user}:${db.pass}@${db.host}:${db.port}/db/data/transaction/commit`

exports.doDatabaseOperation = (query, params) => {
	return new Promise(function (resolve, reject) {
		console.log('params :', params, '\nquery :', query)
		if (params.id)
			params.id = Number(params.id)
		params.now = Date.now()
		request.post({
			uri: txUrl,
			json: {
				statements: [{
					statement: query,
					parameters: params,
					includeStats: true
				}]
			}
		}, (err, res) => {
			console.log("err :", err, '\nres :', res.body)
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
