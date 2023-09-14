const { dbHelper } = require("../database/getLevelDb.js")

exports.updateCreateProcess = (website, products, subjectId) => {
	let keyLevel = 'process_' + website + '_' + subjectId
	let lastId = products[0].itemId
	let lastDate = Date.parse(products[0].itemCreationDate)

	dbHelper.put(keyLevel, { lastDate: lastDate, lastId: lastId }, (err, res) => {
		console.log('Process updated.')
	})
}