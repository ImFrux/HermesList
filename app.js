var console = require('better-console');
require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const schedule = require('node-schedule');
const { launchWatcher } = require('./src/process/watcher.js')
require('./src/discord/loader.js')(client)

// DISCORD
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("v0.0.1")
});
client.login(process.env.DISCORD_TOKEN);

// CRON
schedule.scheduleJob('*/5 * * * *', function () {
	console.log('Launching watcher...')
	launchWatcher(client)
});