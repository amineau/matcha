const neo4j 	= require('node-neo4j');
const confDb	= require('./config/db')

try {
	const connect = "http://" + confDb.user + ":" + confDb.pass + "@" + confDb.host + ":" + confDb.port
	db = new neo4j(connect)
} catch (err) {
	console.log("send mail to amineau@student.42.fr for report err:" + err)
}

module.exports = db