exports.run = (client, message, args) => {
	let resText = "Available commands are :\n"

	client.commands.forEach(element => {
		resText += `${element.name}\n`
	});

	message.channel.send(resText).catch(console.error);
}

exports.name = "help";