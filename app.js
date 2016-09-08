"use strict"

const express 		= require('express')
const session 		= require('express-session')
const bodyParser 	= require('body-parser')
const morgan		= require('morgan')
const config		= require('./config')

const index 			= require("./routes/index")
const createAccount 	= require("./routes/createAccount")
const logout 			= require("./routes/logout")

const app = express()

app.use(session({
		secret: 'azertyu',
		proxy: true,
		resave: true,
    	saveUninitialized: true
    }))
	.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: true}))

	.use(express.static(__dirname + '/public'))
	
	.use('/', index)
	.use('/createAccount', createAccount)
	.use('/logout', logout)

	.use(function(req, res, next) {
		res.setHeader('Content-Type', 'text/html')
		res.status(404).send('Page introuvable !')
	})

 	.listen(config.server.port)

console.log("server starting in " + config.server.host + " " + config.server.port)