const { leveldbHelper } = require("../../database/getLevelDb.js")
const crypto = require("crypto")

exports.run = (client, message, args) => {
	leveldbHelper.get(message.guildId, (err, res) => {
		if (res) {
			let found = false
			res.find((o, i) => {
				if (o.channel === message.channelId && o.subject === args[0]) {
					message.channel.send('Already watching "' + args[0] + '"').catch(console.error);
					found = true
					return true;
				}
			})

			// ADD IT
			if (!found) {
				res.push({ user: message.author.id, channel: message.channelId, subject: args[0], subject_id: crypto.randomUUID() })
				leveldbHelper.putAndSaveKey(message.guildId, res, 'servers', (err) => {
					if (err) {
						console.log('error put', err)
					} else {
						message.channel.send('I will now look for "' + args[0] + '".').catch(console.error);
					}
				})
			}
		} else {
			leveldbHelper.putAndSaveKey(message.guildId, [{ user: message.author.id, channel: message.channelId, subject: args[0], subject_id: crypto.randomUUID() }], 'servers', (err) => {
				if (err) {
					console.log('error put', err)
				} else {
					message.channel.send('I will now look for "' + args[0] + '".').catch(console.error);
				}
			})
		}
	})
}

exports.name = "watch";