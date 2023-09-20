const { leveldbHelper } = require("./getLevelDb.js")
const { zipDirectory } = require('../server/utils')

exports.retrieveSubjectId = (subject, callback) => {
	leveldbHelper.get('servers', (err, ids) => {
		if (ids) {
			ids.forEach(discordId => {
				leveldbHelper.get(discordId, (err, channels) => {
					if (channels) {
						channels.forEach((channel) => {
							if (channel.subject === subject) {
								callback(channel.subject_id)
							}
						})
					}
				})
			});
		}
	})
}

exports.retrieveChannelMarketplace = (channelId, website, callback) => {
	let keyLevel = 'channel_marketplace_' + channelId

	leveldbHelper.get(keyLevel, (err, res) => {
		if (res) {
			callback(res[website])
		} else {

			if (website == 'ebay') {
				callback('EBAY_US')
			} else if (website == 'vinted') {
				callback('com')
			}
			else {
				callback(null)
			}
		}
	})
}

exports.retrieveDatabase = (res, err) => {
	let dateTime = new Date();
	let date = ("0" + dateTime.getDate()).slice(-2);
	let month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
	let year = dateTime.getFullYear();
	let hours = dateTime.getHours();
	let minutes = dateTime.getMinutes();
	let seconds = dateTime.getSeconds();
	let filename = `${__dirname}/save/${year}${month}${date}${hours}${minutes}${seconds}.zip`

	zipDirectory(`${__dirname}/leveldb`, filename)
		.then(_ => {
			res(filename)
		})
		.catch((err) => {
			console.log(err)
		})
}