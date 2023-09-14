const { REST, Routes } = require('discord.js');

const commands = [
	{
		name: `${process.env.COMMAND_NAME} help`,
		description: 'Get list of command.',
	},
	{
		name: `${process.env.COMMAND_NAME} watch "product"`,
		description: 'Susbcribe the channel to a product.',
	}
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
	console.log('Started refreshing application (/) commands.');

	await rest.put(Routes.applicationCommands(process.env.APP_DIDSCORD_CLIENT_ID), { body: commands });

	console.log('Successfully reloaded application (/) commands.');
} catch (error) {
	console.error(error);
}