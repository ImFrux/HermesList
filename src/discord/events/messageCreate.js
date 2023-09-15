module.exports = (client, message) => {

	// Ignore all bots
	if (message.author.bot) return;

	// Ignore messages not starting with the prefix
	if (message.content.indexOf(process.env.COMMAND_NAME) !== 0) return;

	// Load args
	const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
	const args = [];
	message.content.match(regex).forEach(element => {
		if (!element) return;
		return args.push(element.replace(/"/g, ''));
	});
	args.shift()

	let cmd = null
	if (args.length > 0) {
		// Our standard argument/command name definition.
		const command = args.shift().toLowerCase();

		// Grab the command data from the client.commands Enmap
		cmd = client.commands.get(command);
	}

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) {
		message.channel.send(`Command not found, use "help" to get the commands.`).catch(console.error);
		return
	};

	// Run the command
	cmd.run(client, message, args);
};