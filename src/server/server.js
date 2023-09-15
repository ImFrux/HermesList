const http = require("http");
const fileSystem = require('fs')
const port = 8000;
const { cronPing } = require('./keepAlive.js')
const { retrieveDatabase } = require('../database/utils.js')

function sendFile(filePath, res) {
	var stat = fileSystem.statSync(filePath);
	res.writeHead(200, {
		'Content-Type': 'application/zip',
		'Content-Length': stat.size
	});

	var readStream = fileSystem.createReadStream(filePath);
	readStream.pipe(res);
}

const requestListener = function (req, res) {
	if (req.url == '/' || req.url == '/health') {
		res.writeHead(200);
		res.end("OK");
	}

	if (req.url == '/database') {
		const userpass = Buffer.from(
			(req.headers.authorization || '').split(' ')[1] || '',
			'base64'
		).toString();

		if (userpass !== `${process.env.DATABASE_DL_USER}:${process.env.DATABASE_DL_PASS}`) {
			res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="nope"' });
			res.end('HTTP Error 401 Unauthorized: Access is denied');
			return;
		} else {
			retrieveDatabase((filename) => {
				sendFile(filename, res)
			})
		}
	}
}

const server = http.createServer(requestListener);
server.listen(port, process.env.SERVER_IP_INTERN, () => {
	console.log(`Server running on port ${port}`)
});
server.timeout = 50000

// KEEPALIVE
cronPing();

