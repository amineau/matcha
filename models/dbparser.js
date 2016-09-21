"use strict";

const _ = require('underscore');

module.exports = class ParseDatabase {
	
	
	GetTrue(body) {
		return new Promise((resolve, reject) => {
			if (typeof body.results[0].data[0] === "undefined")
				resolve();
			reject({
					status: 403,
					error: "Aucune donnée trouvée"
				});
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
				error: "Aucune donnée trouvée"
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
			let json = [];
			let data;
			let index;

			if (typeof result !== "undefined") {
				for (let i = 0; i < result.data.length; i++) {
					if ((index = result.columns.indexOf("all")) != -1)
						data = result.data[i].row[index];
					else
						data = {};
					for (let j = 0; j < result.columns.length; j++) {
						if (j != index)
							data[result.columns[j]] = result.data[i].row[j];
					}
					json.push(data);
				}
				if (!_.isEmpty(json)) {
					resolve({
						results: json
					});
				}
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