const fs = require("fs");
const { Collection } = require("discord.js");

module.exports = function (client) {

	client.commands = new Collection();

	const events = fs.readdirSync("./src/discord/events").filter(file => file.endsWith(".js"));
	for (const file of events) {
		const eventName = file.split(".")[0];
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client));
	}

	const commands = fs.readdirSync("./src/discord/commands").filter(file => file.endsWith(".js"));
	for (const file of commands) {
		const commandName = file.split(".")[0];
		const command = require(`./commands/${file}`);

		console.log(`Attempting to load command ${commandName}`);
		client.commands.set(commandName, command);
	}
}