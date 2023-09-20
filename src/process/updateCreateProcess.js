const { leveldbHelper } = require("../database/getLevelDb.js")

exports.updateCreateProcess = (website, products, subjectId) => {
	let keyLevel = 'process_' + website + '_' + subjectId

	if (website == 'ebay') {
		lastId = products[0].itemId
		lastDate = Date.parse(products[0].itemCreationDate)
	} else if (website == 'vinted') {
		lastId = products[0].id
		lastDate = null
	}

	leveldbHelper.put(keyLevel, { lastDate: lastDate, lastId: lastId }, (err, res) => {
		console.log('Process updated.')
	})
}