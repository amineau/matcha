'use strict'

const fs = require('fs')

module.exports = class ParseDatabase {

	GetTrue(body) {
		return new Promise((resolve, reject) => {
			if (!body.errors.length){
				if (body.results[0].stats.contains_updates){
					return resolve()
				} else {
					return reject({error: "Les données d'entrées ne permettent pas d'effectuer l'opération"})
				}
			}
			console.log(body.errors[0])
			return reject({error: "Echec de connection avec la base de donnée"})
		})
	}

	GetId(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0].data[0]
			let id

			if (typeof result !== "undefined" && (id = result.meta[0].id))
				resolve({"id": id})
			reject({error: "Aucune donnée trouvée"})
		})
	}

	GetIds(body) {
		return new Promise((resolve) => {
			const result = body.results[0]
			let id = []

			if (typeof result !== "undefined") {
				result.data.forEach((item) => {
					id.push(item.meta[0].id)
				})
			}
			resolve({id})
		})
	}

	GetList(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0]
			let json = []
			let data
			let index

			if (typeof result !== "undefined" && result.columns.length === 1) {
				for (let i = 0; i < result.data.length; i++) {
					json.push(result.data[i].row[0])
				}
				resolve(json)
			}
			reject({error: "Ressource non trouvée"})
		})
	}

	GetData(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0]
			let json = []
			let data
			let index
			if (typeof result !== "undefined") {
				for (let i = 0; i < result.data.length; i++) {
					if ((index = result.columns.indexOf("all")) != -1)
						data = result.data[i].row[index]
					else
						data = {}
					for (let j = 0; j < result.columns.length; j++) {
						if (j != index)
							data[result.columns[j]] = result.data[i].row[j]
					}
					if (data.path) {
						const bitmap = fs.readFileSync(data.path)
    				data.base64 = 'data:image\/png;base64,' + new Buffer(bitmap).toString('base64')
						delete data.path
					}
					json.push(data)
				}
				resolve(json)
			}
			console.log(body.errors)
			reject({error: "Ressource non trouvée"})
		})
	}

	getDebug(body) {
		console.log(body)
		return Promise.resolve(body)
	}
}
