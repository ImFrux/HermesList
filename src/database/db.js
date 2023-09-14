const { Level } = require('level')
var sublevel = require('level-sublevel/legacy')

class LevelDb {
	constructor(dbPath, options = {}) {
		this.options = options;
		this.db = sublevel(new Level(dbPath, { valueEncoding: "json" }));
		//this.db = Sublevel(LevelUp(dbPath, { valueEncoding: "json" }))
		//this.sub = db.sublevel('stuff')


		// DEBUG @todo remove this + dependency (leveldown)
	}

	putAndSaveKey(key, value, keyList, callback) {
		this.put(key, value, callback)

		// SAVE KEY
		this.get(keyList, (err, res) => {
			if (res) {
				if (!res.includes(key)) {
					res.push(key)
					this.put(keyList, res, (err, res) => {
						if (err) {
							console.log(err)
						}
					})
				}
			} else {
				this.put(keyList, [key], (err, res) => {
					if (err) {
						console.log(err)
					}
				})
			}
		})
	}

	put(key, value, callback) {
		if (key && value) {

			if (typeof value == "object") {
				value = JSON.stringify(value)
			}

			this.db.put(key, value, (error) => {
				callback(error);
			});
		} else {
			callback("no key or value");
		}
	}

	get(key, callback) {
		if (key) {
			this.db.get(key, (error, value) => {
				if (value) {
					try {
						let newValue = JSON.parse(value);
						callback(error, newValue)
					} catch (e) {
						console.log('error', e)
						callback(error, value)
					}
				} else {
					callback('not found', null)
				}

			});
		} else {
			callback("no key", key);
		}
	}

	delete(key, callback) {
		if (key) {
			this.db.del(key, (error) => {
				callback(error);
			});
		} else {
			callback("no key");
		}
	}

	batch(arr, callback) {
		if (Array.isArray(arr)) {
			var batchList = [];
			arr.forEach(item);
			{
				var listMember = {};
				if (item.hasOwnProperty("type")) {
					listMember.type = item.type;
				}
				if (item.hasOwnProperty("key")) {
					listMember.key = item.key;
				}
				if (item.hasOwnProperty("value")) {
					listMember.value = item.value;
				}
				if (
					listMember.hasOwnProperty("type") &&
					listMember.hasOwnProperty("key") &&
					listMember.hasOwnProperty("value")
				) {
					batchList.push(listMember);
				}
			}
			if (batchList && batchList.length > 0) {
				this.db.batch(batchList, (error) => {
					callback(error, batchList);
				});
			} else {
				callback("array member format error");
			}
		} else {
			callback("not array");
		}
	}
}

module.exports = LevelDb;