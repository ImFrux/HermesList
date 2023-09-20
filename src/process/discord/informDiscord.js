const { getDiscordProductEmbed } = require('../../process/discord/getDiscordProductMessage.js')

/**
 * Generate random color hex.
 * 
 * @returns string
 */
function getHex() {
	return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
}

exports.informDiscord = (website, channel, products) => {
	let startMessage = `<@${channel.user}> ${products.length} new item(s) found on ${website.charAt(0).toUpperCase() + website.slice(1)} for "${channel.subject}".\n`
	channel.client.channels.cache.get(channel.channel).send(startMessage)

	let randGroupColor = getHex()
	products.forEach((item, i) => {
		products[i].groupColor = randGroupColor

		if (website == 'ebay') {
			products[i].priceFormatted = `${item.price.value} ${item.price.currency}`
			if (item.shippingOptions) {
				item.shippingOptions.forEach((element) => {
					if (element.shippingCostType === 'FIXED' && parseFloat(element.shippingCost.value) > 0) {
						let shipping = ` (+ ${element.shippingCost.value} ${element.shippingCost.currency})`
						products[i].priceFormatted += shipping
					}
				})
			}
		}
		else if (website == 'vinted') {
			products[i].priceFormatted = `${item.price} ${item.currency}`
			products[i].itemWebUrl = item.url
			if (item.photo.url) {
				products[i].thumbnailImages = [{}]
				products[i].thumbnailImages[0].imageUrl = item.photo.url
			}
		}
		channel.client.channels.cache.get(channel.channel).send({ embeds: [getDiscordProductEmbed(item)] })
	})
}