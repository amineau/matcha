const neo4j = require('node-neo4j');
const conf	= require('./config')

try {
	const connect = "http://" + conf.database.user + ":" + conf.database.pass + "@" + conf.database.host + ":" + conf.database.port
	db = new neo4j(connect)
} catch (err) {
	console.log("send mail to amineau@student.42.fr for report err:" + err)
}

module.exports = db