const { dbHelper } = require("../database/getLevelDb.js")
const { searchEbayItems } = require("../api/ebayApi.js")
const { searchVintedItems } = require("../api/vintedApi.js")
const { updateCreateProcess } = require("./updateCreateProcess.js")
const { retrieveSubjectId, retrieveChannelMarketplace } = require('../database/utils.js')
const { informDiscord } = require('./discord/informDiscord.js')

function retrieveLastProcessData(website, channel, callback) {
	retrieveSubjectId(channel.subject, (subjectId) => {
		let keyLevel = 'process_' + website + '_' + subjectId
		dbHelper.get(keyLevel, (err, process) => {
			if (process) {
				callback(process, subjectId)
			} else {
				if (website == 'ebay') {

					retrieveChannelMarketplace(channel.channel, 'ebay', (marketplace) => {
						if (marketplace) {

							searchEbayItems(channel.subject, 1).then((lastItem) => {
								lastItem = JSON.parse(lastItem)
								if (lastItem.total > 0) {
									lastDate = lastItem.itemSummaries[0].itemCreationDate
									lastId = lastItem.itemSummaries[0].itemId

									let data = { lastDate: Date.parse(lastDate), lastId: lastId }
									dbHelper.put(keyLevel, data, (err, res) => {
										callback(data, subjectId)
									})
								} else {
									callback(false)
								}
							})
						}
					})
				} else if (website == 'vinted') {

					/*					searchVintedItems(channel.subject, 1).then((lastItem) => {
											//console.log(lastItem)
											//console.log(channel.subject, lastItem)
											if (lastItem.total > 0) {
												lastDate = lastItem.itemSummaries[0].itemCreationDate
												lastId = lastItem.itemSummaries[0].itemId
					
												let data = { lastDate: Date.parse(lastDate), lastId: lastId }
												dbHelper.put(keyLevel, data, (err, res) => {
													callback(data, subjectId)
												})
											} else {
												callback(false)
											}
										})*/
				}
			}
		})
	})
}

function processEbay(channel) {
	retrieveLastProcessData('ebay', channel, (lastProcessData, subjectId) => {
		if (lastProcessData) {

			retrieveChannelMarketplace(channel.channel, 'ebay', (marketplace) => {
				if (marketplace) {
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

						console.log('NEW:', newProducts.length)
						if (newProducts.length !== 0) {
							informDiscord(channel, newProducts)
							updateCreateProcess('ebay', newProducts, subjectId)
						}
					})


				}
			})

		}
	})
}

function processVinted(channel) {
	retrieveLastProcessData('vinted', channel, (lastProcessData, subjectId) => {
		console.log(channel.subject, lastProcessData)
		if (lastProcessData) {
			console.info(channel.subject, lastProcessData)
			/*searchVintedItems(channel.subject, 100).then((products) => {
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

				console.log('NEW:', newProducts.length)
				if (newProducts.length !== 0) {
					informDiscord(channel, newProducts)
					updateCreateProcess('ebay', newProducts, subjectId)
				}
			})*/
		}
	})
}

module.exports.launchWatcher = function (client) {
	// Get all discord server ID
	dbHelper.get('servers', (err, ids) => {
		if (ids) {
			ids.forEach(discordId => {
				dbHelper.get(discordId, (err, channels) => {
					if (channels) {
						channels.forEach((channel) => {
							channel.client = client
							processEbay(channel)
							//processVinted(channel)
						})
					}
				})
			});
		}
	})
}