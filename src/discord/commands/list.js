const { dbHelper } = require("../../database/getLevelDb.js")

exports.run = (client, message, args) => {
	let subjects = []
	dbHelper.get(message.guildId, (err, res) => {
		if (res) {
			res.find((o, i) => {
				if (o.channel === message.channelId) {
					subjects.push(o.subject)
				}
			})

			message.channel.send('Currently watching on this channel :\n' + subjects.join('\n')).catch(console.error);
		}
	})
}

exports.name = "list";