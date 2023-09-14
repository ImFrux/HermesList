exports.run = (client, message, args) => {
	message.channel.send("This bot was developped by Frux. Contact @imfrux on Discord.").catch(console.error);
}

exports.name = "credit";