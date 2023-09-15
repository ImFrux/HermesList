const archiver = require('archiver');
const fileSystem = require('fs')

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
exports.zipDirectory = (sourceDir, outPath) => {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fileSystem.createWriteStream(outPath);

	return new Promise((resolve, reject) => {
		archive
			.directory(sourceDir, false)
			.on('error', err => reject(err))
			.pipe(stream)

		stream.on('close', () => resolve());
		archive.finalize();
	});
}