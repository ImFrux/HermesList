const { leveldbHelper } = require("../database/getLevelDb.js")
const { processEbay } = require('./processEbay.js')
const { processVinted } = require('./processVinted.js')

module.exports.launchWatcher = function (client) {
	// Get all discord server ID
	leveldbHelper.get('servers', (err, ids) => {
		if (ids) {
			ids.forEach(discordId => {
				leveldbHelper.get(discordId, (err, channels) => {
					if (channels) {
						channels.forEach((channel) => {
							channel.client = client
							processEbay(channel)
							processVinted(channel)
						})
					}
				})
			});
		}
	})
}