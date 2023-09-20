const LevelDB = require("./levelDb.js");
const path = require("path");

module.exports.leveldbHelper = new LevelDB(
	path.resolve(__dirname, process.env.LEVELDB_FOLDER)
);