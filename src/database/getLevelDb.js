const LevelDB = require("../../src/database/db.js");
const path = require("path");

module.exports.dbHelper = new LevelDB(
	path.resolve(__dirname, process.env.LEVELDB_FOLDER)
);