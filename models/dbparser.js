"use strict";

module.exports = class ParseDatabase {
	
	
	GetTrue(body) {
		return new Promise((resolve) => {
			resolve({success: typeof body.results[0].data[0] !== "undefined"});
		});
	}

	GetId(body) {
		return new Promise((resolve) => {
			const result = body.results[0];
			let id;

			if (typeof result !== "undefined") {
				id = result.data[0].meta[0].id;
			}
			if (id)
				resolve({"id": id});
			reject({
				status: 403,
				error: "Aucun utilisateur trouvé"
			});
		})
	}

	GetIds(body) {
		return new Promise((resolve) => {
			const result = body.results[0];
			let ids = [];

			if (typeof result !== "undefined") {
				result.data.forEach((item) => {
					ids.push(item.meta[0].id);
				});
			}
			resolve({
				"id": ids
			});
		})
	}

	GetData(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0];
			let data = [];

			if (typeof result !== "undefined") {
				result.data.forEach((item) => {
					data.push(item.row[0]);
				});
				if (data.length > 0)
					resolve(data);
			}
			reject({
				status: 404,
				error: "Ressource non trouvée"
			});
		})
	}

	getDebug(body) {
		console.log(body);
		return body;
	}
};