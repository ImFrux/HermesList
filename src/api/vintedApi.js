const fetch = require('node-fetch-commonjs');
const randomUseragent = require('random-useragent');
const cookie = require('cookie');

const cookies = new Map();

//fetches a Vinted cookie to authenticate the requests
const fetchCookie = (domain = 'fr') => {
	return new Promise((resolve, reject) => {
		const controller = new AbortController();
		fetch(`https://vinted.${domain}`, {
			signal: controller.signal,
			headers: {
				'user-agent': randomUseragent.getRandom().toString()
			}
		}).then((res) => {
			const sessionCookie = res.headers.get('set-cookie');
			controller.abort();
			const c = cookie.parse(sessionCookie)['secure, _vinted_fr_session'];
			if (c) {
				cookies.set(domain, c);
			}
			resolve(c);
		}).catch((err) => {
			controller.abort();
			reject(err);
		});
	});
};

const parseVintedURL = (search_text, data) => { //order = "newest_first", domain = 'fr', catalog_ids = "", color_ids = "", brand_ids = "", size_ids = "", material_ids = "", video_game_rating_ids = "", status_ids = "", is_for_swap = 0, page = 1, per_page = 100) => {
	let defaultValues = { order: "newest_first", domain: 'fr', catalog_ids: "", color_ids: "", brand_ids: "", size_ids: "", material_ids: "", video_game_rating_ids: "", status_ids: "", is_for_swap: 0, page: 1, per_page: 100 }
	search_text = search_text.replace(' ', '%20')
	return `https://www.vinted.${data.domain ?? defaultValues.domain}/api/v2/catalog/items?search_text=${search_text}&order=${data.order ?? defaultValues.order}&catalog_ids=${data.catalog_ids ?? defaultValues.catalog_ids}&color_ids=${data.color_ids ?? defaultValues.color_ids}&brand_ids=${data.brand_ids ?? defaultValues.brand_ids}&size_ids=${data.size_ids ?? defaultValues.size_ids}&material_ids=${data.material_ids ?? defaultValues.material_ids}&video_game_rating_ids=${data.video_game_rating_ids ?? defaultValues.video_game_rating_ids}&status_ids=${data.status_ids ?? defaultValues.status_ids}&is_for_swap=${data.is_for_swap ?? defaultValues.is_for_swap}&page=${data.page ?? defaultValues.page}&per_page=${data.per_page ?? defaultValues.per_page}`
};

/**
 * Search an item on vinted
 *
 * @param {string} search_text - The text to search
 * @param {string} order - The order of the results (optional, default is newest_first)
 * @returns {Promise} A promise that resolves to the results
 */
exports.searchVintedItems = (search_text, limit, domain, order = "newest_first") => {
	return new Promise(async (resolve, reject) => {
		//var c = cookies.get('fr') || await fetchCookie('fr')
		var c = await fetchCookie('fr')
		const controller = new AbortController();
		console.log(parseVintedURL(search_text, { per_page: limit }))
		fetch(parseVintedURL(search_text, { per_page: limit }), {
			headers: {
				'user-agent': randomUseragent.getRandom().toString(),
				'cookie': '_vinted_fr_session=' + c,
				'accept': 'application/json, text/plain, */*'
			}
		}).then(res => {
			controller.abort();
			res.json().then(data => {
				resolve(data);
			});
		}).catch(err => {
			controller.abort();
			reject(err);
		});
	})
}