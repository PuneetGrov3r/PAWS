'use strict'


const req = require('request');

const Weather = (key) => ({
	currentWeather: (lat = '28.612205', lon = '77.034980', callback) => {
		const state = {
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/weather'
		}
		state.url += '?lat=' + lat + '&lon=' + lon + '&APPID=' + key;
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					console.log(data);
				})
				.catch( (error) => {
					console.log(error);
				})
			}else if(err){
				console.log(err);
			}		
		})
	},

	forecast: (lat = '28.612205', lon = '77.034980', callback) => {
		const state = {
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/forecast'
		}
		state.url += '?lat=' + lat + '&lon=' + lon + '&APPID=' + key;
		req(state, (err, res, body) => {
			if(!err && res.statusCode === 200){
				let p = new Promise((resolve, reject) => {
					resolve(JSON.parse(body));
				});
				p.then( (data) => {
					callback(data)
					console.log(data);
				})
				.catch( (error) => {
					console.log(error);
				})
				return p
			}else if(err){
				console.log(err);
			}		
		})
	}
})
exports.Weather = Weather

//Weather('fd69a8bec4fb9cd33f7a1cf60f4871eb').forecast();