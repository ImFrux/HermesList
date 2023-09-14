const https = require('https')
const schedule = require('node-schedule');

exports.cronPing = () => {
	schedule.scheduleJob('*/14 * * * *', function () {
		https
			.get(process.env.URL_WEBSITE, (res) => {
				if (res.statusCode == '200') {
					console.log('Server was pinged.')
				} else {
					console.log(`Failed to ping with statusCode ${res.statusCode}`)
				}
			})
			.on('error', (err) => {
				console.log('Error during restart: ', err.message)
			})
	})
}