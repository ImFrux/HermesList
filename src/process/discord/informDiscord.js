const { getDiscordProductEmbed } = require('../../process/discord/getDiscordProductMessage.js')

/**
 * Generate random color hex.
 * 
 * @returns string
 */
function getHex() {
	return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
}

exports.informDiscord = (channel, products) => {
	let startMessage = `<@${channel.user}> ${products.length} new item(s) found on Ebay for "${channel.subject}".\n`
	channel.client.channels.cache.get(channel.channel).send(startMessage)

	let randGroupColor = getHex()
	products.forEach((item, i) => {
		products[i].priceFormatted = `${item.price.value} ${item.price.currency}`
		products[i].groupColor = randGroupColor
		if (item.shippingOptions) {
			item.shippingOptions.forEach((element) => {
				if (element.shippingCostType === 'FIXED' && parseFloat(element.shippingCost.value) > 0) {
					let shipping = ` (+ ${element.shippingCost.value} ${element.shippingCost.currency})`
					products[i].priceFormatted += shipping
				}
			})
		}
		channel.client.channels.cache.get(channel.channel).send({ embeds: [getDiscordProductEmbed(item)] })
	})

	/*let totalWords = 0
	let currentMessage = ''
	productMessage.forEach((message) => {
		if (totalWords + message.length < 2000) {
			currentMessage += message
		} else {
			channel.client.channels.cache.get(channel.channel).send(currentMessage)
			currentMessage = message
			totalWords = 0
		}
		totalWords += message.length
	})

	if (currentMessage.length > 0) {
		channel.client.channels.cache.get(channel.channel).send(currentMessage)
	}*/
}