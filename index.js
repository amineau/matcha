//"use strict"
// const app = require('./app')
// const config = require ('./config')

// server = app.listen(config.port)
// console.log("server starting in " + config.host + " " + config.port)

// const io = require('socket.io')
// const socket = io.listen(server, { log: false })

// function testLength(str, min, max) {
// 	if (str.length == 0)
// 		return null
// 	if (str.length < min)
// 		return "Trop court"
// 	if (str.length > max)
// 		return "Trop long"
// 	return "Caractère(s) non conforme(s)"
// }

// socket.on('connection', function (client) {

// 	client.on('sign', function (ret) {
// 			var err = 0
// 			var mes = null
// 			console.log(ret.id + " : " + ret.val)
// 			switch (ret.id){

// 				case 'login':
// 					if (!ret.val.match(/^[a-zA-Z0-9'àâéèêôùûçÀÂÉÈÔÙÛÇ\s_-]{3,50}$/)) {
// 						err = 1
// 						mes = testLength(ret.val, 3, 50)
// 					}
// 					break;

// 				case 'email':
// 					if (!ret.val.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
// 						err = 1
// 					break;

// 				case 'firstName':
// 				case 'lastName':
// 					if (!ret.val.match(/^[a-zA-Z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{1,50}$/)) {
// 						err = 1
// 						mes = testLength(ret.val, 1, 50)
// 					}
// 					break;

// 				case 'password':
// 					if (ret.val.length < 6){
// 						err = 1
// 						mes = "Mot de passe trop court"
// 					} else if (!ret.val.match(/[a-zA-Z]/) || !ret.val.match(/[0-9]/)) {
// 						err = 1
// 						mes ="Le mot de passe doit contenir au moins un lettre et un chiffre"
// 					}
// 					break;

// 			}
// 			socket.emit('error', {"id": ret.id, "val": err, "message": mes})
// 		})
// })