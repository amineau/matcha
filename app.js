"use strict"

const express 		= require('express')
const bodyParser 	= require('body-parser')
const morgan		= require('morgan')
const confServer	= require('./config/server')

let app = express()

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))

	.use(express.static(__dirname + '/public'))

//Routes
require('./routes/user')(app)

app.listen(confServer.port)
console.log("Server starting in " + confServer.host + " " + confServer.port)