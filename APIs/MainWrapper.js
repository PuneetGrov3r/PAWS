const f2f = require('./Food2ForkWrapper.js');
const ow = require('./OpenWeatherWrapper.js');
const mp = require('./MapsAPIWrapper.js');
const wk = require('./WikiWrapper.js');
const mrk = require('./MarkitAPIWrapper.js');

exports.food2fork = {
	"search": f2f('xxx').search(),
	"recipe": f2f('xxx').recipe(),
	"searchNRecipe": f2f('xxx').searchNRecipe() // Source URL Imp., contains how to make...
}

exports.maps = {
	"places":mp('xxx').places(),
	"direction":mp('xxx').direction()
}

exports.weather = {
	"current": ow('fd69a8bec4fb9cd33f7a1cf60f4871eb').currentWeather,
	"forecast": ow('fd69a8bec4fb9cd33f7a1cf60f4871eb').forecast
}

exports.wiki = {
	"defination": wk().getDefination(),
	"url": wk().getURL(),  // takes name of article as argument same as getSummary
	"locality": wk().getLocality(),
	"summary": wk().getSummary()
}

exports.markit = {
	"lookup": mrk().lookup(),
	"price": mrk().price(),
	"lookupNPrice": mrk().lookupNPrice()
}