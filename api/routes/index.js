'use strict'

const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
		console.log(req.session)
		res.setHeader('Content-Type', 'application/JSON')
		res.send({login: req.session.login})
	})

module.exports = router