"use strict"

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const conf = require('./config/conf')

let app = express()

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))

	.use(session({
		secret: conf.session.secret,
		resave: "true",
		saveUninitialized: "true"
		// cookie: {}
	}))
	.use(express.static(__dirname + '/public'))


//Routes
require('./routes/user')(app)
require('./routes/tags')(app)
require('./routes/pics')(app)
require('./routes/connexion')(app)

app.listen(conf.server.port)
console.log(`Server starting in ${conf.server.host} ${conf.server.port}`)
