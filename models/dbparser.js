"use strict";

module.exports = class ParseDatabase {
	
	
	getTrue(body) {
		return new Promise((resolve) => {
			resolve({success: typeof body.results[0].data[0] !== "undefined"});
		});
	}

	getId(body) {
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

	getData(body) {
		return new Promise((resolve) => {
			const result = body.results[0];
			let data = [];

			if (typeof result !== "undefined") {
				result.data.forEach((item) => {
					data.push(item.row[0]);
				});
			}
			resolve(data[0]);
		})
	}

	getDebug(body) {
		console.log(body);
		return body;
	}
}