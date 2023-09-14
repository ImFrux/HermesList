
const { EmbedBuilder } = require('discord.js');

/*row = new MessageActionRow()
	.addComponents(new MessageButton().setEmoji('➕').setLabel("Plus d'info").setURL(item.url.info).setStyle("LINK"))
	.addComponents(new MessageButton().setEmoji('💬').setLabel("Envoyer un message").setURL(item.url.sendmsg).setStyle("LINK"))
	.addComponents(new MessageButton().setEmoji('💸').setLabel("Acheter").setURL(item.url.buy).setStyle("LINK")),*/
exports.getDiscordProductEmbed = (item) => {
	return new EmbedBuilder()
		.setTitle(item.title)
		.setURL(item.itemWebUrl)
		.setColor(item.groupColor)
		.setThumbnail(item.thumbnailImages ? item.thumbnailImages[0].imageUrl : null)
		.addFields(
			{ name: '`💸` Price', value: `\`${item.priceFormatted}\``, inline: true },
		);
}


