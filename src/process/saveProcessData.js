const { leveldbHelper } = require('../database/getLevelDb')

exports.saveProcessData = (keyLevel, data) => {
	leveldbHelper.put(keyLevel, data, (err, res) => {
	})
}