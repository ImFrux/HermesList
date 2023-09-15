const LevelDB = require("../../src/database/db.js");
const path = require("path");

module.exports.dbHelper = new LevelDB(
	path.resolve(process.env.LEVELDB_FOLDER)
);