const f2f = require('./Food2ForkWrapper.js');
const ow = require('./OpenWeatherWrapper.js');
const mp = require('./MapsAPIWrapper.js');
const wk = require('./WikiWrapper.js');
const mrk = require('./MarkitAPIWrapper.js');
const bw = require('./bing_news.js');
const bnw = new bw();

exports.food2fork = {
	"search": f2f().search,
	"recipe": f2f().recipe,
	"searchNRecipe": f2f().searchNRecipe // Source URL Imp., contains how to make...
}

exports.maps = {
	"places":mp().places,
	"direction":mp().direction
}

exports.open_weather = {
	"current": ow().currentWeather,
	"forecast": ow().forecast
}


exports.Wikipedia = {
	"definition": wk().getDefination,
	"url": wk().getSummary,  // takes name of article as argument same as getSummary
	"locality": wk().getLocality,
	"summary": wk().getURL
}



exports.markit = {
	"lookup": mrk().lookup,
	"price": mrk().price,
	"lookupNPrice": mrk().lookupNPrice
}

exports.bing = {
	"caterogry": bnw.categoryNews,
	"search": bnw.searchNews
}