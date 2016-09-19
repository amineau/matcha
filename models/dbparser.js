"use strict";

module.exports = class ParseDatabase {
	
	
	GetTrue(body) {
		return new Promise((resolve) => {
			resolve({success: typeof body.results[0].data[0] !== "undefined"});
		});
	}

	GetId(body) {
		return new Promise((resolve, reject) => {
			const result = body.results[0].data[0];
			let id;

			if (typeof result !== "undefined" && (id = result.meta[0].id))
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
		console.log(body.results[0]);
		return new Promise((resolve, reject) => {
			const result = body.results[0];
			let json = {};
			let data;
			if (typeof result !== "undefined") {
				for (let i = 0; i < result.columns.length; i++) {
					data = [];
					for (let j = 0; j < result.data.length; j++) {
						data.push(result.data[j].row[i]);
					}
					json[result.columns[i]] = data;
				}

				result.data.forEach((item) => {
					data.push(item.row[0]);
				});
				console.log("data : ", data);
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