const http = require("http");
const port = 8000;
const { cronPing } = require('./keepAlive.js')

const requestListener = function (req, res) {
	if (req.url == '/' || req.url == '/health') {
		res.writeHead(200);
		res.end("OK");
	}
}

const server = http.createServer(requestListener);
server.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`)
});

// KEEPALIVE
cronPing();

