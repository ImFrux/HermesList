const { dbHelper } = require("../../database/getLevelDb")

function saveEbayMarketplace(client, message, args) {
	let keyLevel = 'channel_marketplace_' + message.channelId
	let validMarketplace = ["EBAY_US", "EBAY_AT", "EBAY_AU", "EBAY_BE", "EBAY_CA", "EBAY_CH", "EBAY_DE", "EBAY_ES", "EBAY_FR", "EBAY_GB", "EBAY_HK", "EBAY_IE", "EBAY_IT", "EBAY_MY", "EBAY_NL", "EBAY_PH", "EBAY_PL", "EBAY_SG", "EBAY_TW"]

	if (args[1] && validMarketplace.includes(args[1])) {
		dbHelper.get(keyLevel, (err, res) => {
			if (res) {
				res.ebay = args[1]
				dbHelper.put(keyLevel, res, (err, res) => {
					message.channel.send(`Ebay marketplace is now set to ${args[1]} for this channel.`).catch(console.error);
				})
			} else {
				dbHelper.put(keyLevel, { ebay: args[1] }, (err, res) => {
					message.channel.send(`Ebay marketplace is now set to ${args[1]} for this channel.`).catch(console.error);
				})
			}
		})
	} else {
		message.channel.send(`Use command : set ebay [id_marketplace]\n\nWhere [id_marketplace] is one of those values:\n${validMarketplace.join('\n')}`).catch(console.error);
	}
}

exports.run = (client, message, args) => {

	let setCommands = ["ebay"]
	if (!args[0] || !setCommands.includes(args[0])) {
		message.channel.send(`Command not found, available 'set' arguments are :\n${setCommands.join('\n')}`).catch(console.error);
	}
	else if (args[0] == 'ebay') {
		saveEbayMarketplace(client, message, args)
	}

}

exports.name = "set";