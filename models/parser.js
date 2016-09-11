/*jshint node:true */

"use strict";

class ParseDatabase {
	
	
	getIds(body) {
		
		const result = body.results[0];
		let ids = [];

		if (typeof result !== undefined) {
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

		if (typeof result !== undefined) {
			result.data.forEach((item) => {	
				data.push(item.row[0]);
			});
		}
		return {
			"data": data
		};
	}
}

module.exports = ParseDatabase;