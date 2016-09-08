var express = require("express")
var Verif	= require("../signUp")
var db		= require("../db")
var _ 		= require("underscore");
var router  = express.Router()

router.get('/', function(req, res) {
		// res.setHeader('Content-Type', 'application/JSON')
		// res.send('pages/createAccount.ejs')
	})

	.post('/', function(req, res) {
		var user  = req.query
		var verif = Verif(user)
		var result = {addUser: "no"}

		if (_.isEmpty(verif)) {
			db.cypherQuery(
				'CREATE(user: User { login: {login}, email: {email}, firstName: {firstName}, lastName: {lastName}, password: {password} }) RETURN *',
				{
					login: user.login,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					password: user.password
				},
				function (err, res) {
					if (err){
						result = {
							addUser: "no",
							error: "Un problème de connection avec la base de données a été constasté.",
							code: err
						}
					} else {
						result = {
							addUser: "yes",
							idUser: res.data[0]._id
						}
					}
					callback(result)
				}
			)
		} else {
			result = {
				addUser: "no",
				error: "Les données que vous avez renseignés ne sont pas correctes."
			}
			callback(result)
		}

		function callback(result) {
			res.setHeader('Content-Type', 'application/JSON')
			res.send(result)
		}
		// req.session.login = req.body.user.login
		// req.session.pass  = req.body.user.password
	})

module.exports = router