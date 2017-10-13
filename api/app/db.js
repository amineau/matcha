'use strict'

const request = require('request')
const db = require('./config/conf').neo4j

const txUrl = `http://${db.user}:${db.pass}@${db.host}:${db.port}/db/data/transaction/commit`

exports.doDatabaseOperation = (query, params) => {
	return new Promise(function (resolve, reject) {
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
	    	if (err) return reject({error: err})
		    resolve(res.body)
	    })
	})
}
