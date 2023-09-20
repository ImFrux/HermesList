const { retrieveSubjectId, retrieveChannelMarketplace } = require('../database/utils')
const { searchEbayItems } = require('../api/ebayApi')
const { leveldbHelper } = require('../database/getLevelDb')
const { searchVintedItems } = require('../api/vintedApi')
const { saveProcessData } = require('./saveProcessData.js')

exports.retrieveLastProcessData = (website, channel, callback) => {
	retrieveSubjectId(channel.subject, (subjectId) => {
		let keyLevel = 'process_' + website + '_' + subjectId
		leveldbHelper.get(keyLevel, (err, process) => {
			if (process) {
				callback(process, subjectId)
			} else {

				retrieveChannelMarketplace(channel.channel, website, (marketplace) => {
					if (website == 'ebay') {
						searchEbayItems(channel.subject, 1, marketplace).then((lastItem) => {
							lastItem = JSON.parse(lastItem)
							if (lastItem.total > 0) {
								let data = { lastDate: Date.parse(lastItem.itemSummaries[0].itemCreationDate), lastId: lastItem.itemSummaries[0].itemId }
								saveProcessData(keyLevel, data)
								callback(data, subjectId)
							} else {
								callback(false)
							}
						})
					} else if (website == 'vinted') {
						searchVintedItems(channel.subject, 1).then(items => {
							if (items.items && items.items.length > 0) {
								let vintedData = { lastDate: Date.now(), lastId: items.items[0].id }
								saveProcessData(keyLevel, vintedData)
								callback(vintedData, subjectId)
							} else {
								callback(false)
							}
						})
					}
				})
			}
		})
	})
}