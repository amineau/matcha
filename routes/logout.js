var express = require("express")
var router  = express.Router()

router.get('/logout', function(req, res) {
		req.session.destroy(function(err) {
			if (err) {
				console.log("Déconnexion impossible : " + err)
			}
		})
		res.redirect('/')
	})

module.exports = router