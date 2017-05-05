'use strict'

const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
		res.setHeader('Content-Type', 'application/JSON')
		res.send({login: req.decoded.login})
	})

module.exports = router
