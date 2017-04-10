'use strict'

module.exports = class ParseDatabase {

	GetTrue(body) {
		return new Promise((resolve, reject) => {
			if (!body.errors.length){
				if (body.results[0].stats.contains_updates){
					return resolve()
				} else {
					return reject({
						status: 403,
						error: "Les données d'entrées ne permettent pas d'effectuer l'opération"
					})
				}
			}
			return reject({
					status: 400,
					error: "Echec de connection avec la base de donnée"
				})
		})
	}

	GetId(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0].data[0]
			let id

			if (typeof result !== "undefined" && (id = result.meta[0].id))
				resolve({"id": id})
			reject({
				status: 404,
				error: "Aucune donnée trouvée"
			})
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
					json.push(data)
				}
				resolve(json)
			}
			reject({
				status: 404,
				error: "Ressource non trouvée"
			})
		})
	}

	getDebug(body) {
		console.log(body)
		return Promise.resolve(body)
	}
}
