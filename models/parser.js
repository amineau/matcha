/*jshint node:true */

"use strict";

class ParseDatabase {
	
	
	getTrue(body) {
		
		const result = body.results[0].data[0];
		if (typeof result !== "undefined")
			return {success: true};
		return {success: false};
	}

	getIds(body) {
		
		const result = body.results[0];
		let ids = [];

		if (typeof result !== "undefined") {
			result.data.forEach((item) => {	
				ids.push(item.meta[0].id);
			});
		}
		return {
			"id": ids
		};
	}

	getData(body) {
		const result = body.results[0];
		let data = [];

		if (typeof result !== "undefined") {
			result.data.forEach((item) => {	
				data.push(item.row[0]);
			});
		}
		return data;
	}

	getDebug(body) {
		console.log(body);
		return body;
	}
}

module.exports = ParseDatabase;