const { dbHelper } = require("./getLevelDb.js")

exports.retrieveSubjectId = (subject, callback) => {
	dbHelper.get('servers', (err, ids) => {
		if (ids) {
			ids.forEach(discordId => {
				dbHelper.get(discordId, (err, channels) => {
					if (channels) {
						channels.forEach((channel) => {
							if (channel.subject === subject) {
								callback(channel.subject_id)
							}
						})
					}
				})
			});
		}
	})
}

exports.retrieveChannelMarketplace = (channelId, website, callback) => {
	let keyLevel = 'channel_marketplace_' + channelId

	dbHelper.get(keyLevel, (err, res) => {
		if (res) {
			callback(res[website])
		} else {
			callback('EBAY_US')
		}
	})
}