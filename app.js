"use strict"

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const conf = require('./config/conf')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// Connection URL
var url = 'mongodb://localhost:27017/matcha'
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server")
  db.close()
})

let app = express()

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))

	.use(session({
		secret: conf.session.secret,
		resave: "true",
		saveUninitialized: "true",
		cookie: {}
	}))
	.use(express.static(__dirname + '/public'))


//Routes
require('./routes/user')(app)
require('./routes/tags')(app)
require('./routes/pics')(app)
require('./routes/connexion')(app)
require('./routes/notif')(app)
// require('./routes/chat')(app)

// (:User)--------	<= Dernier message lu
// 	 			        \
//	 		(:Chat)->(:Chat)->(:Chat)
//	 												/
// (:User) ----------------

// OU

// (:User1)
// 	 		\ <= notif = true lorsque User2 écrit
//	 		(:Chat)->(:Chat)->(:Chat)
//	 		/
// (:User2)

app.listen(conf.server.port)
console.log(`Server starting in ${conf.server.host} ${conf.server.port}`)
