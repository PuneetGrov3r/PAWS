'use strict'


const req = require('request');


const Weather = () => ({
	currentWeather: (more = {'lat' : '28.612205', 'lon' : '77.034980'}, callback) => {
		const key = 'fd69a8bec4fb9cd33f7a1cf60f4871eb'
		const state = {
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/weather'
		}
		state.url += '?lat=' + more['lat'] + '&lon=' + more['lon'] + '&APPID=' + key;
		let o = [];
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					//console.log(data)
					let out = {}
					out['image_url'] = 'http://openweathermap.org/img/w/' + data['weather'][0]['icon'] + '.png'
					if(data['sys']['country']){
						out['title'] = data['name'] + ', ' + data['sys']['country']
					}else{
						out['title'] = data['name']
					}
					out['main'] = data['weather'][0]['main']
					out['temp'] = data['main']['temp']
					out['pressure'] = data['main']['pressure']
					out['humidity'] = data['main']['humidity']
					out['visibility'] = data['visibility']
					out['wind'] = data['wind']['speed']
					out['clouds'] = data['clouds']['all']
					o.push(out);
					callback(null, o);
					//console.log(out);
				})
				.catch( (error) => {
					callback(error, null);
				})
			}else if(err){
				callback(err, null);
			}		
		})
	},

	forecast: (more = {'lat' : '28.612205', 'lon' : '77.034980'}, callback) => {
		const key = 'fd69a8bec4fb9cd33f7a1cf60f4871eb'
		const state = {
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/forecast/daily'
		}
		state.url += '?lat=' + more['lat'] + '&lon=' + more['lon'] + '&APPID=' + key;
		let out = [];
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					
					out['location'] = data['city']['name'] + ', ' + data['city']['country']
					data['list'].forEach( function(el, index) {
						console.log(el)
						let obj = {}
						obj['title'] = new Date(el['dt']*1000).toDateString()
						obj['image_url'] = 'http://openweathermap.org/img/w/' + el['weather'][0]['icon'] + '.png'
						obj['pressure'] = el['pressure']
						obj['humidity'] = el['humidity']
						obj['wind'] = el['speed']
						obj['clouds'] = el['clouds']
						if(el['rain']) obj['rain'] = el['rain']
						obj['temp_min'] = el['temp']['min']
						obj['temp_max'] = el['temp']['max']
						out.push(obj)
					});
					callback(null, out)
				})
				.catch( (error) => {
					callback(error, null);
				})
			}else if(err){
				callback(err, null);
			}		
		})
	}
})


module.exports = Weather

var more= {'lat':'28.612205', 'lon':'77.034980'}

Weather().forecast(more, (err, data) => {
	if(!err && data){
		console.log(data)
	}
})

/*
Weather().currentWeather(more, (err, data) => {
	if(!err && data){
		console.log(data)
	}else{
		console.log(data, err)
	}
});
*/
