const f2f = require('./Food2ForkWrapper.js');
const ow = require('./OpenWeatherWrapper.js');
const mp = require('./MapsAPIWrapper.js');
const wk = require('./WikiWrapper.js');

exports.food2fork = {
	"search": f2f('xxx').search(),
	"recipe": f2f('xxx').recipe(),
	"searchNRecipe": f2f('xxx').searchNRecipe()
}

exports.maps = {
	"places":mp('xxx').places(),
	"direction":mp('xxx').direction()
}

exports.weather = {
	"current": ow('xxx').currentWeather(),
	"forecast": ow('xxx').forecast()
}

exports.wiki = {
	"defination": wk().getDefination(),
	"url": wk().getURL(),
	"locality": wk().getLocality(),
	"summary": wk().getSummary()
}