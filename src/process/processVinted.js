const { retrieveLastProcessData } = require('./retrieveLastProcessData')
const { searchVintedItems } = require('../api/vintedApi')
const { retrieveChannelMarketplace } = require('../database/utils.js')
const { informDiscord } = require('./discord/informDiscord.js')
const { updateCreateProcess } = require('./updateCreateProcess')

exports.processVinted = (channel) => {
	retrieveLastProcessData('vinted', channel, (lastProcessData, subjectId) => {
		if (lastProcessData) {

			retrieveChannelMarketplace(channel.channel, 'vinted', (marketplace) => {
				searchVintedItems(channel.subject, 100, marketplace).then((products) => {
					let newProducts = []

					if (products.items) {
						products.items.every((product) => {

							if (lastProcessData.lastId && product.id === lastProcessData.lastId) {
								console.log('Last item found. Leaving vinted loop.')
								return false
							}

							// TIMESTAMP IS MISSING IN VINTED API DATA
							/*if (lastProcessData.lastDate && lastProcessData.lastDate >= Date.parse(product.itemCreationDate)) {
								console.log('Last item date is older. Leaving loop.')
								return false
							}*/

							newProducts.push(product)

							// KEEP LOOPING
							return true
						})

						console.log('VINTED NEW:', newProducts.length)
						if (newProducts.length !== 0) {
							informDiscord('vinted', channel, newProducts)
							updateCreateProcess('vinted', newProducts, subjectId)
						}
					}
				})
			})
		}
	})
}