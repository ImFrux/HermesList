const { leveldbHelper } = require("../../database/getLevelDb")

function getEbayMarketplace(client, message, args) {
	let keyLevel = 'channel_marketplace_' + message.channelId
	leveldbHelper.get(keyLevel, (err, res) => {
		if (res) {
			message.channel.send(`Ebay marketplace is set to ${res.ebay} for this channel.`).catch(console.error);
		} else {
			message.channel.send(`Ebay marketplace is set to EBAY_US for this channel.`).catch(console.error);
		}
	})
}

exports.run = (client, message, args) => {

	let getCommands = ["ebay"]
	if (!args[0] || !getCommands.includes(args[0])) {
		message.channel.send(`Command not found, available 'get' arguments are :\n${getCommands.join('\n')}`).catch(console.error);
	}
	else if (args[0] == 'ebay') {
		getEbayMarketplace(client, message, args)
	}

}

exports.name = "get";