"use strict"

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const {port, host} = require('./config/conf').server
const {secret} = require('./config/conf').session
const assert = require('assert')
const Queries = require('./queries')

let app = express()

app.set('query', new Queries())

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))
	.use(session({
		secret,
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
require('./routes/chat')(app)
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

app.listen(port)
console.log(`Server starting in ${host}:${port}`)
