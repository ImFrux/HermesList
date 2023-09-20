const { retrieveChannelMarketplace } = require('../database/utils.js')
const { retrieveLastProcessData } = require('./retrieveLastProcessData')
const { searchEbayItems } = require("../api/ebayApi.js")
const { updateCreateProcess } = require("./updateCreateProcess.js")
const { informDiscord } = require('./discord/informDiscord.js')

exports.processEbay = (channel) => {
	retrieveLastProcessData('ebay', channel, (lastProcessData, subjectId) => {
		if (lastProcessData) {

			retrieveChannelMarketplace(channel.channel, 'ebay', (marketplace) => {
				searchEbayItems(channel.subject, 100, marketplace).then((products) => {
					let newProducts = []
					products = JSON.parse(products)
					console.log(products.itemSummaries.length + ' item founds for ' + channel.subject)
					products.itemSummaries.every((product) => {

						if (lastProcessData.lastId && product.itemId === lastProcessData.lastId) {
							console.log('Last item found. Leaving loop.')
							return false
						}

						if (lastProcessData.lastDate && lastProcessData.lastDate >= Date.parse(product.itemCreationDate)) {
							console.log('Last item date is older. Leaving loop.')
							return false
						}

						newProducts.push(product)

						// KEEP LOOPING
						return true
					})

					console.log('EBAY NEW:', newProducts.length)
					if (newProducts.length !== 0) {
						informDiscord('ebay', channel, newProducts)
						updateCreateProcess('ebay', newProducts, subjectId)
					}
				})

			})
		}
	})
}