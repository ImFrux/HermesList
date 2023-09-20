const { leveldbHelper } = require("../../database/getLevelDb.js")

exports.run = (client, message, args) => {
	leveldbHelper.get(message.guildId, (err, res) => {
		if (res) {
			let found = false
			res.find((o, i) => {
				if (o.channel === message.channelId && o.subject === args[0]) {
					found = true

					// REMOVE IT
					res.splice(i, 1);

					// UPDATE IN DB
					leveldbHelper.put(message.guildId, res, (err) => {
						if (err) {
							console.log('error put', err)
						} else {
							message.channel.send('Term "' + args[0] + '" was removed from the watchlist').catch(console.error);
						}
					})

					return true
				}
			})

			if (!found) {
				message.channel.send('Term "' + args[0] + '" was not found in the watchlist').catch(console.error);
			}
		}
	})
}

exports.name = "unwatch";