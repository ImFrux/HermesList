let eBay = require("ebay-node-api");
let clientID = process.env.EBAY_ENV === 'PRODUCTION' ? process.env.EBAY_CLIENT_ID_PRODUCTION : process.env.EBAY_CLIENT_ID_SANDBOX
let clientSecret = process.env.EBAY_ENV === 'PRODUCTION' ? process.env.EBAY_CLIENT_SECRET_PRODUCTION : process.env.EBAY_CLIENT_SECRET_SANDBOX

exports.searchEbayItems = (keyword, limit, marketplace = 'EBAY_US') => {

	let ebay = new eBay({
		clientID: clientID,
		clientSecret: clientSecret,
		env: process.env.EBAY_ENV,
		headers: {
			"X-EBAY-C-MARKETPLACE-ID": marketplace
		}
	});

	return ebay.getAccessToken()
		.then((data) => {
			return ebay.searchItems({
				keyword: keyword,
				limit: limit.toString(),
				sort: 'newlyListed'
			}).then((data) => {
				return data
			})
		});
}