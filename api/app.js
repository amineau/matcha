"use strict"

const express = require('express')
const passport = require('./passport')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const nconf = require('nconf')
const path = require('path')
const fs = require('fs')
const Queries = require('./queries')

let app = express()

nconf.env()
nconf.file({file: path.join(__dirname, 'config/conf.json')})

app.set('query', new Queries())
app.set('nconf', nconf)

app.use(morgan('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))
	.use(passport.initialize())
	.use(passport.session())
	.use(express.static(__dirname + '/public'))
	.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
		res.header("Access-Control-Allow-Headers", "Origin, matcha-token,Content-Type")
		next()
	})
	.use((req, res, next) => {
	  const token = req.headers['matcha-token']
	  jwt.verify(token, nconf.get('token:secret'), (err, decoded) => {
	    const id = err ? 'guest' : decoded.id
	    const ipInfo = req.headers['x-forwarded-for'] ||
	      req.connection.remoteAddress ||
	      req.socket.remoteAddress ||
	      req.connection.socket.remoteAddress
	    fs.open(path.join(__dirname, 'logs', 'restrict.log'), 'a', (err, fd) => {
	      if (err) throw err
	      const buffer = `${new Date().toUTCString()} | id : ${id} | ${ipInfo} | ${req.method} ${req.originalUrl}\n`
	      fs.write(fd, buffer, (err, written) => {
	        if (err) throw err
	        fs.close(fd, err => {
						if (err) throw err
					})
	      })
	    })
	    next()
	  })
	})



//Routes
require('./routes/user')(app)
require('./routes/tags')(app)
require('./routes/pics')(app)
require('./routes/connexion')(app)
require('./routes/notif')(app)
require('./routes/chat')(app)


app.listen(nconf.get('server:port'))
console.log(`Server starting in ${nconf.get('server:host')}:${nconf.get('server:port')}`)
